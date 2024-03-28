var connection = require('../../utils/connection');

const getPurches = async (mediaId, userId) => {
  const response = await connection.query(
    'SELECT * FROM purchase WHERE CustomerId = ? AND MediaId = ? AND isReviewed = 0',
    [userId, mediaId]
  );
  return response;
};

const getAvgRattings = async (mediaId) => {
  const response = await connection.query(
    'SELECT AVG(rating) FROM reviews WHERE MediaId = ?',
    [mediaId]
  );

  return response[0];
};

const getReview = async (Id) => {
  const response = await connection.query(
    'SELECT * FROM reviews WHERE Id = ?',
    [Id]
  );
  return response[0];
};

const review = {
  async getReviews(req, res) {
    const mediaId = req.params.mediaId;
    try {
      const response = await connection.query(
        'SELECT * FROM reviews WHERE MediaId = ? ORDER BY created_at DESC',
        [mediaId]
      );
      res.json(response);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  },
  async createReview(req, res) {
    const mediaId = req.params.mediaId;
    const { userId } = req.body;
    if (!userId || !mediaId) {
      return res
        .json({
          success: false,
          errors: {
            invalid: 'Invalid Request',
          },
        })
        .status(400);
    }

    const purchase = await getPurches(mediaId, userId);

    if (purchase.length > 0) {
      const { rating, comment } = req.body;
      let success = true;
      const errors = {
        rating: null,
        comment: null,
      };

      if (rating < 1 || rating > 5) {
        errors.rating = 'Please provide a valid rating';
        success = false;
      }

      if (comment.trim() === '') {
        errors.comment = 'Please provide a comment';
        success = false;
      }

      if (!success) {
        return res.json({
          success,
          errors,
        });
      }
      try {
        const result = await connection.query(
          'INSERT INTO reviews (rating, comment, MediaId, CustomerId) VALUES (?, ?, ?, ?)',
          [rating, comment, mediaId, userId]
        );

        connection.query('UPDATE purchase SET isReviewed = 1 WHERE Id = ?', [
          purchase[0].Id,
        ]);

        let avgRatting = await getAvgRattings(mediaId);
        avgRatting = avgRatting['AVG(rating)'];
        connection.query('UPDATE media SET avg_rattings = ? WHERE Id = ?', [
          avgRatting,
          mediaId,
        ]);

        res.json({
          success,
          message: 'Review has been created successfully',
          avgRatting: avgRatting,
          review: {
            ...(await getReview(result.insertId)),
          },
        });
      } catch (error) {
        console.error('Error creating review:', error);
        res.json({ error: 'Internal server error' }).status(500);
      }
    } else {
      return res
        .json({
          success: false,
          errors: {
            invalid: 'Invalid Request',
          },
        })
        .status(400);
    }
  },
};

module.exports = review;
