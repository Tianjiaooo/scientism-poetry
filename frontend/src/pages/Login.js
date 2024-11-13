import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = React.useState('');
  const { t } = useTranslation(['auth']);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('auth:login.form.email.invalid'))
      .required(t('auth:login.form.email.required')),
    password: Yup.string()
      .required(t('auth:login.form.password.required'))
      .min(6, t('auth:login.form.password.minLength')),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      const data = await authService.login(values);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || t('auth:login.errors.failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          {t('auth:login.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          {t('auth:login.subtitle')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form style={{ width: '100%' }}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label={t('auth:login.form.email.label')}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                margin="normal"
              />
              <TextField
                fullWidth
                id="password"
                name="password"
                label={t('auth:login.form.password.label')}
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                margin="normal"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 2 }}
              >
                {t('auth:login.form.submit')}
              </Button>
            </Form>
          )}
        </Formik>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" align="center">
            {t('auth:login.noAccount')}{' '}
            <Link component={RouterLink} to="/register">
              {t('auth:login.signUp')}
            </Link>
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            <Link component={RouterLink} to="/forgot-password">
              {t('auth:login.forgotPassword')}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
