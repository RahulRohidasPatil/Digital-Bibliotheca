import React from "react";
// import { useRouter } from 'next/router'

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { setCookie } from "cookies-next";
import { loginUser } from "../apis/login";

import Link from "next/link";


function Login() {
    // const router = useRouter()
    const onFinish = async (values: any) => {
        const resp = await loginUser({email: values.email, password: values.password}).catch(err => console.log(err))
        if(resp && resp.status === 200){
          setCookie('token', resp.data.data)
        //   router.back()
        }
      };

    return (
      <div className="wrapper">
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
            Forgot password?
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
            </Button>
            {" "}Or{" "}
            <Link className="login-form-register" href="/registration">register now!</Link>
          </Form.Item>
        </Form>
      </div>
    );
}

export default Login;