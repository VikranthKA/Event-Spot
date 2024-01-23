import React, { useState } from 'react';
import axios from '../Api_Resources/axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import {useNavigate} from 'react-router-dom'

const registerValidationSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(8).max(16),
  role: yup.string().required(),
  username: yup.string().required(),
  number: yup.string().required(),
});

export default function Register() {
  const [serverErrors, setServerErrors] = useState('');
  const navigate  = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      role: '',
      username: '',
      number: '',
    },
    validateOnChange: false,
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('/api/user/register', values);
        console.log(response);
        navigate('/login')
      } catch (e) {
        setServerErrors(e.response.data.errors.join(', ')); // Corrected how serverErrors are displayed
        console.error(e)
      }
    },
  });

  return (
    <div className="container mt-6 position-relative">
      <h2 className="fs-1">Sign Up</h2>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username:
              </label>
              <input
                type="text"
                className={`form-control ${formik.errors.username ? 'is-invalid' : ''}`} // Corrected the template string
                id="username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
              />
              <div className="invalid-feedback">{formik.errors.username}</div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                type="text"
                className={`form-control ${formik.errors.email ? 'is-invalid' : ''}`} // Corrected the template string
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              <div className="invalid-feedback">{formik.errors.email}</div>
            </div>

            <div className="mb-3">
              <label htmlFor="number" className="form-label">
                Number:
              </label>
              <input
                type="text"
                className={`form-control ${formik.errors.number ? 'is-invalid' : ''}`} // Corrected the template string
                id="number"
                name="number"
                value={formik.values.number}
                onChange={formik.handleChange}
              />
              <div className="invalid-feedback">{formik.errors.number}</div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                type="password"
                className={`form-control ${formik.errors.password ? 'is-invalid' : ''}`} // Corrected the template string
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              <div className="invalid-feedback">{formik.errors.password}</div>
            </div>

            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Role:
              </label>
              <select
                className={`form-select ${formik.errors.role ? 'is-invalid' : ''}`} // Corrected the template string
                id="role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
              >
                <option value="" disabled>Select a role</option>
                <option value="Customer">Customer</option>
                <option value="Organiser">Organiser</option>
              </select>
              <div className="invalid-feedback">{formik.errors.role}</div>
            </div>

            <button type="submit" className="btn btn-dark">
              Signup
            </button>
            <button className="btn btn-dark" onClick={()=>navigate('/login')}>
             SignIn
            </button>
          </form>
        </div>
      </div>

      {serverErrors && <div className="alert alert-danger mt-3">{serverErrors}</div>}
    </div>
  );
}
