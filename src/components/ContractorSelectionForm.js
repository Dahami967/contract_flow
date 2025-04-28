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
import { Save } from '@mui/icons-material';
import { formatLKR, parseLKR } from '../utils/formatters';

const validationSchema = Yup.object({
  dateAwarded: Yup.date().required('Date Awarded is required'),
  contractorName: Yup.string().required('Contractor Name is required'),
  contractNo: Yup.string().required('Contract No is required'),
  contractAmount: Yup.number()
    .transform((value) => parseLKR(value))
    .test('is-number', 'Must be a valid number', (value) => value === '' || !isNaN(value))
    .min(0, 'Must be greater than or equal to 0')
    .required('Contract Amount is required'),
  vatDetails: Yup.string().required('VAT Details is required'),
  contractPeriod: Yup.string().required('Contract Period is required'),
  performanceBondBank: Yup.string().required('Performance Bond Bank is required'),
  performanceBondAmount: Yup.number()
    .transform((value) => parseLKR(value))
    .test('is-number', 'Must be a valid number', (value) => value === '' || !isNaN(value))
    .min(0, 'Must be greater than or equal to 0')
    .required('Performance Bond Amount is required'),
  performanceBondExpiry: Yup.date().required('Performance Bond Expiry Date is required'),
});

function ContractorSelectionForm() {
  const formik = useFormik({
    initialValues: {
      dateAwarded: null,
      contractorName: '',
      contractNo: '',
      contractAmount: '',
      vatDetails: '',
      contractPeriod: '',
      performanceBondBank: '',
      performanceBondAmount: '',
      performanceBondExpiry: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formattedValues = {
        ...values,
        contractAmount: parseLKR(values.contractAmount),
        performanceBondAmount: parseLKR(values.performanceBondAmount)
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
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{ 
            color: 'primary.main',
            fontWeight: 600,
            mb: 3
          }}
        >
          Contractor Selection
        </Typography>
        
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
                Contract Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date Awarded"
                value={formik.values.dateAwarded}
                onChange={(value) => formik.setFieldValue('dateAwarded', value)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.dateAwarded && Boolean(formik.errors.dateAwarded),
                    helperText: formik.touched.dateAwarded && formik.errors.dateAwarded,
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
                id="contractorName"
                name="contractorName"
                label="Contractor Name"
                value={formik.values.contractorName}
                onChange={formik.handleChange}
                error={formik.touched.contractorName && Boolean(formik.errors.contractorName)}
                helperText={formik.touched.contractorName && formik.errors.contractorName}
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
                id="contractNo"
                name="contractNo"
                label="Contract No"
                value={formik.values.contractNo}
                onChange={formik.handleChange}
                error={formik.touched.contractNo && Boolean(formik.errors.contractNo)}
                helperText={formik.touched.contractNo && formik.errors.contractNo}
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
                id="contractAmount"
                name="contractAmount"
                label="Contract Amount"
                value={formik.values.contractAmount ? formatLKR(formik.values.contractAmount) : ''}
                onChange={(e) => {
                  const parsed = parseLKR(e.target.value);
                  formik.setFieldValue('contractAmount', parsed);
                }}
                error={formik.touched.contractAmount && Boolean(formik.errors.contractAmount)}
                helperText={formik.touched.contractAmount && formik.errors.contractAmount}
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
                Contract Terms
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="vatDetails"
                name="vatDetails"
                label="VAT Details"
                multiline
                rows={2}
                value={formik.values.vatDetails}
                onChange={formik.handleChange}
                error={formik.touched.vatDetails && Boolean(formik.errors.vatDetails)}
                helperText={formik.touched.vatDetails && formik.errors.vatDetails}
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
                id="contractPeriod"
                name="contractPeriod"
                label="Contract Period"
                value={formik.values.contractPeriod}
                onChange={formik.handleChange}
                error={formik.touched.contractPeriod && Boolean(formik.errors.contractPeriod)}
                helperText={formik.touched.contractPeriod && formik.errors.contractPeriod}
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
                Performance Bond Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="performanceBondBank"
                name="performanceBondBank"
                label="Performance Bond Bank/Institute"
                value={formik.values.performanceBondBank}
                onChange={formik.handleChange}
                error={formik.touched.performanceBondBank && Boolean(formik.errors.performanceBondBank)}
                helperText={formik.touched.performanceBondBank && formik.errors.performanceBondBank}
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
                id="performanceBondAmount"
                name="performanceBondAmount"
                label="Performance Bond Amount"
                value={formik.values.performanceBondAmount ? formatLKR(formik.values.performanceBondAmount) : ''}
                onChange={(e) => {
                  const parsed = parseLKR(e.target.value);
                  formik.setFieldValue('performanceBondAmount', parsed);
                }}
                error={formik.touched.performanceBondAmount && Boolean(formik.errors.performanceBondAmount)}
                helperText={formik.touched.performanceBondAmount && formik.errors.performanceBondAmount}
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
                label="Performance Bond Expiry Date"
                value={formik.values.performanceBondExpiry}
                onChange={(value) => formik.setFieldValue('performanceBondExpiry', value)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.performanceBondExpiry && Boolean(formik.errors.performanceBondExpiry),
                    helperText: formik.touched.performanceBondExpiry && formik.errors.performanceBondExpiry,
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
                Save Contractor Details
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default ContractorSelectionForm;