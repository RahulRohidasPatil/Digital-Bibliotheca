import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
// import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import { registrateUser } from "../apis/registration";

type Inputs = {
  firstName: string;
  lastName: string;
  age: number;
  emailAddress: string;
  password: string;
  phone: string;
  address: string;
  role: number;
};

export default function RegForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => onFinish(data);


//   const router = useRouter();

  //note: right now the user needs to input all data-fields so the registration-process is working (because of the type-definition?)
  //so to test it type in all fields, even if some of them are not needed for the backend/API

  const onFinish = async (values: any) => {
    const resp = await registrateUser({
      firstName: values.firstName,
      lastName: values.lastName,
      age: values.age,
      emailAddress: values.emailAddress,
      password: values.password,
      phone: values.phone,
      address: values.address,
      role: 1,
    }).catch( (err: any) => console.log(err));

    if (resp && resp.status === 200) {
      setCookie("token", resp.data.data);
      /* router.push("/"); */
      /* router.back(); //would go back to Login page usually because most users come to the registration page via the login form*/
      window.history.go(-2);
    }
  };

  return (
    <section className="section-container">
      <div className="register">
        <div className="col-1">
          <h2>Registration</h2>
          <span>register and enjoy the service</span>

          <form
            id="form"
            className="flex flex-col"
            onSubmit={handleSubmit(onSubmit, onFinish)}
          >
            <input
              {...register("firstName", { required: true })}
              placeholder="First Name"
            />
            {errors.firstName && <span>First name is required</span>}
            <input
              {...register("lastName", { required: true })}
              placeholder="Last Name"
            />
            {errors.lastName && <span>Last name is required</span>}
            <input
              {...register("age", { required: true })}
              placeholder="Age"
            />
            {errors.age && <span>age is required</span>}
            <input
              {...register("emailAddress", { required: true, pattern: {
                value: /^[A-Za-z0-9._%+-]+@[\w-]+\.hs-fulda\.de$/i,
                message: "Please enter a valid email"
              }, })}
              placeholder="example@department.hs-fulda.de"
              required
              className="input"
            />
            {errors.emailAddress && <span>{errors.emailAddress.message}</span>}
            <input
            type='password'
              {...register("password", { required: true })}
              placeholder="password"
            />
            {errors.password && <span>password is required</span>}
            <input
              {...register("phone", { required: false })}
              placeholder="Phone"
            />
            {errors.phone && <span>phone number is required</span>}
            <input
              {...register("address", { required: false })}
              placeholder="Address"
            />  
            {errors.address && <span>address is required</span>}
            {/* <input
              type="number"
              {...register("role", { required: false })}
              placeholder="role"
              min="1" max="2"
            />
            {errors.role && <span>role is required</span>} */}

            <button className="btn">Sign Up</button>
          </form>
        </div>
        <div className="col-2">
          {/* <img src={bgImg.src} alt="" /> */}
        </div>
      </div>
    </section>
  );
}
