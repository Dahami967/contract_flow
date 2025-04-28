import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Divider,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Save, Payment } from '@mui/icons-material';
import { formatLKR, parseLKR } from '../utils/formatters';

const validationSchema = Yup.object({
  dateOfPayment: Yup.date().required('Date of Payment is required'),
  amountPaid: Yup.number()
    .transform((value) => parseLKR(value))
    .test('is-number', 'Must be a valid number', (value) => value === '' || !isNaN(value))
    .min(0, 'Must be greater than or equal to 0')
    .required('Amount Paid is required'),
  advanceBondBank: Yup.string().required('Advance Bond Bank is required'),
  advanceBondAmount: Yup.number()
    .transform((value) => parseLKR(value))
    .test('is-number', 'Must be a valid number', (value) => value === '' || !isNaN(value))
    .min(0, 'Must be greater than or equal to 0')
    .required('Advance Bond Amount is required'),
  advanceBondExpiry: Yup.date().required('Advance Bond Expiry Date is required'),
});

function AdvancePaymentForm() {
  const formik = useFormik({
    initialValues: {
      dateOfPayment: null,
      amountPaid: '',
      advanceBondBank: '',
      advanceBondAmount: '',
      advanceBondExpiry: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formattedValues = {
        ...values,
        amountPaid: parseLKR(values.amountPaid),
        advanceBondAmount: parseLKR(values.advanceBondAmount)
      };
      console.log('Form values:', formattedValues);
    },
  });

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', pt: 1 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
          background: 'linear-gradient(to right bottom, #ffffff, #f8fafc)',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Payment 
            sx={{ 
              fontSize: 28, 
              color: 'primary.main',
              mr: 2
            }} 
          />
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 600
            }}
          >
            Advance Payment Details
          </Typography>
        </Box>
        
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: 'secondary.main',
                  fontWeight: 500,
                  mb: 2
                }}
              >
                Payment Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date of Payment"
                value={formik.values.dateOfPayment}
                onChange={(value) => formik.setFieldValue('dateOfPayment', value)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.dateOfPayment && Boolean(formik.errors.dateOfPayment),
                    helperText: formik.touched.dateOfPayment && formik.errors.dateOfPayment,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff'
                      }
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="amountPaid"
                name="amountPaid"
                label="Amount Paid"
                value={formik.values.amountPaid ? formatLKR(formik.values.amountPaid) : ''}
                onChange={(e) => {
                  const parsed = parseLKR(e.target.value);
                  formik.setFieldValue('amountPaid', parsed);
                }}
                error={formik.touched.amountPaid && Boolean(formik.errors.amountPaid)}
                helperText={formik.touched.amountPaid && formik.errors.amountPaid}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff'
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: 'secondary.main',
                  fontWeight: 500,
                  mb: 2,
                  mt: 2
                }}
              >
                Advance Bond Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="advanceBondBank"
                name="advanceBondBank"
                label="Advance Bond Bank/Institute"
                value={formik.values.advanceBondBank}
                onChange={formik.handleChange}
                error={formik.touched.advanceBondBank && Boolean(formik.errors.advanceBondBank)}
                helperText={formik.touched.advanceBondBank && formik.errors.advanceBondBank}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff'
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="advanceBondAmount"
                name="advanceBondAmount"
                label="Advance Bond Amount"
                value={formik.values.advanceBondAmount ? formatLKR(formik.values.advanceBondAmount) : ''}
                onChange={(e) => {
                  const parsed = parseLKR(e.target.value);
                  formik.setFieldValue('advanceBondAmount', parsed);
                }}
                error={formik.touched.advanceBondAmount && Boolean(formik.errors.advanceBondAmount)}
                helperText={formik.touched.advanceBondAmount && formik.errors.advanceBondAmount}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff'
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Advance Bond Expiry Date"
                value={formik.values.advanceBondExpiry}
                onChange={(value) => formik.setFieldValue('advanceBondExpiry', value)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.advanceBondExpiry && Boolean(formik.errors.advanceBondExpiry),
                    helperText: formik.touched.advanceBondExpiry && formik.errors.advanceBondExpiry,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff'
                      }
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<Save />}
                sx={{ 
                  mt: 4,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(37, 99, 235, 0.3)',
                  }
                }}
              >
                Save Advance Payment Details
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default AdvancePaymentForm;