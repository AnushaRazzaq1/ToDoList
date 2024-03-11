// LoginPage.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setIsLoggedIn }) => {
  const initialValues = {
    username: '',
    password: '',
    remember: false,
  };

  const validationSchema = Yup.object().shape({
   username: Yup.string()
       .required('Please enter your username!'),

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
        body: JSON.stringify({         //payload
          username: values.username,
          password: values.password,
        }),
      });

      const responseJSON = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
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
    <div className="login-container">
      <h2>Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <Field name="username" as={Input} prefix={<UserOutlined />} placeholder="Username" />
              <ErrorMessage name="username" component="div" className="error-message" style={{ color: 'red' }} />
            </div>
            <div>
              <Field name="password" as={Input.Password} prefix={<LockOutlined />} placeholder="Password" />
              <ErrorMessage name="password" component="div" className="error-message" style={{ color: 'red' }} />
            </div>
            <div>
              <Field name="remember" as={Checkbox}>Remember me</Field>
            </div>
            <div>
              <Button type="primary" htmlType="submit" loading={isSubmitting} className="login-form-button">
                Log in
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
