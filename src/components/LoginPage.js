import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

const LoginPage = ({ setIsLoggedIn, setUsername }) => {
  const initialValues = {
    username: '',
    password: '',
    remember: false,
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Please enter your username!'),
    password: Yup.string()
      .required('Please enter your password!')
      .min(6, 'Password must be at least 6 characters long'),
  });

  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('https://api.freeapi.app/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      const responseJSON = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        setUsername(values.username);
        message.success('Login successful!');
        navigate('/todo', { replace: true });
      } else {
        message.error(responseJSON.message || 'Failed to login');
      }
    } catch (error) {
      console.error('Error during login:', error);
      message.error('An error occurred during login');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl mb-6 text-center">Login</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <Field
                  name="username"
                  as={Input}
                  prefix={<UserOutlined />}
                  placeholder="Username"
                  className="w-full py-3 px-4 border border-gray-300 rounded"
                />
                <ErrorMessage name="username" component="div" className="text-red-500 mt-1" />
              </div>
              <div className="mb-4">
                <Field
                  name="password"
                  as={Input.Password}
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  className="w-full py-3 px-4 border border-gray-300 rounded"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 mt-1" />
              </div>
              <div className="mb-4 flex items-center">
                <Field type="checkbox" name="remember" className="mr-2" />
                <label htmlFor="remember" className="text-sm">Remember me</label>
              </div>
              <div>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  className="w-full py-3 px-4 rounded focus:outline-none"
                  style={{ backgroundColor: '#1677ff', color: '#fff', height: '50px' }} 
                >
                  Log in
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
