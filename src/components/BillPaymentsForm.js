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
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Save, Receipt } from '@mui/icons-material';
import { formatLKR, parseLKR } from '../utils/formatters';

const validationSchema = Yup.object({
  dateOfPayment: Yup.date().required('Date of Payment is required'),
  billNo: Yup.string().required('Bill No is required'),
  billAmount: Yup.number()
    .transform((value) => parseLKR(value))
    .test('is-number', 'Must be a valid number', (value) => value === '' || !isNaN(value))
    .min(0, 'Must be greater than or equal to 0')
    .required('Bill Amount is required'),
  recoveryAdvance: Yup.number()
    .transform((value) => parseLKR(value))
    .test('is-number', 'Must be a valid number', (value) => value === '' || !isNaN(value))
    .min(0, 'Must be greater than or equal to 0')
    .required('Advance Recovery is required'),
  recoveryLiquidityDamages: Yup.number()
    .transform((value) => parseLKR(value))
    .test('is-number', 'Must be a valid number', (value) => value === '' || !isNaN(value))
    .min(0, 'Must be greater than or equal to 0')
    .required('Liquidity Damages Recovery is required'),
  recoveryOthers: Yup.number()
    .transform((value) => parseLKR(value))
    .test('is-number', 'Must be a valid number', (value) => value === '' || !isNaN(value))
    .min(0, 'Must be greater than or equal to 0')
    .required('Other Recoveries is required'),
  recoveryRetention: Yup.number()
    .transform((value) => parseLKR(value))
    .test('is-number', 'Must be a valid number', (value) => value === '' || !isNaN(value))
    .min(0, 'Must be greater than or equal to 0')
    .required('Retention Recovery is required'),
});

function BillPaymentsForm() {
  const formik = useFormik({
    initialValues: {
      dateOfPayment: null,
      billNo: '',
      billAmount: '',
      recoveryAdvance: '0',
      recoveryLiquidityDamages: '0',
      recoveryOthers: '0',
      recoveryRetention: '0',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formattedValues = {
        ...values,
        billAmount: parseLKR(values.billAmount),
        recoveryAdvance: parseLKR(values.recoveryAdvance),
        recoveryLiquidityDamages: parseLKR(values.recoveryLiquidityDamages),
        recoveryOthers: parseLKR(values.recoveryOthers),
        recoveryRetention: parseLKR(values.recoveryRetention),
      };
      console.log('Form values:', formattedValues);
    },
  });

  // Calculate net payment amount
  const netPayment = React.useMemo(() => {
    const billAmount = Number(parseLKR(formik.values.billAmount)) || 0;
    const recoveries = (
      Number(parseLKR(formik.values.recoveryAdvance)) +
      Number(parseLKR(formik.values.recoveryLiquidityDamages)) +
      Number(parseLKR(formik.values.recoveryOthers)) +
      Number(parseLKR(formik.values.recoveryRetention))
    ) || 0;
    return billAmount - recoveries;
  }, [formik.values]);

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
          <Receipt 
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
            Bill Payment Details
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
                Bill Information
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
                id="billNo"
                name="billNo"
                label="Bill No"
                value={formik.values.billNo}
                onChange={formik.handleChange}
                error={formik.touched.billNo && Boolean(formik.errors.billNo)}
                helperText={formik.touched.billNo && formik.errors.billNo}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff'
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="billAmount"
                name="billAmount"
                label="Bill Amount"
                value={formik.values.billAmount ? formatLKR(formik.values.billAmount) : ''}
                onChange={(e) => {
                  const parsed = parseLKR(e.target.value);
                  formik.setFieldValue('billAmount', parsed);
                }}
                error={formik.touched.billAmount && Boolean(formik.errors.billAmount)}
                helperText={formik.touched.billAmount && formik.errors.billAmount}
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
                Recoveries
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="recoveryAdvance"
                name="recoveryAdvance"
                label="Advance Recovery"
                value={formik.values.recoveryAdvance ? formatLKR(formik.values.recoveryAdvance) : ''}
                onChange={(e) => {
                  const parsed = parseLKR(e.target.value);
                  formik.setFieldValue('recoveryAdvance', parsed);
                }}
                error={formik.touched.recoveryAdvance && Boolean(formik.errors.recoveryAdvance)}
                helperText={formik.touched.recoveryAdvance && formik.errors.recoveryAdvance}
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
              <TextField
                fullWidth
                id="recoveryLiquidityDamages"
                name="recoveryLiquidityDamages"
                label="Liquidity Damages"
                value={formik.values.recoveryLiquidityDamages ? formatLKR(formik.values.recoveryLiquidityDamages) : ''}
                onChange={(e) => {
                  const parsed = parseLKR(e.target.value);
                  formik.setFieldValue('recoveryLiquidityDamages', parsed);
                }}
                error={formik.touched.recoveryLiquidityDamages && Boolean(formik.errors.recoveryLiquidityDamages)}
                helperText={formik.touched.recoveryLiquidityDamages && formik.errors.recoveryLiquidityDamages}
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
              <TextField
                fullWidth
                id="recoveryOthers"
                name="recoveryOthers"
                label="Other Recoveries"
                value={formik.values.recoveryOthers ? formatLKR(formik.values.recoveryOthers) : ''}
                onChange={(e) => {
                  const parsed = parseLKR(e.target.value);
                  formik.setFieldValue('recoveryOthers', parsed);
                }}
                error={formik.touched.recoveryOthers && Boolean(formik.errors.recoveryOthers)}
                helperText={formik.touched.recoveryOthers && formik.errors.recoveryOthers}
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
              <TextField
                fullWidth
                id="recoveryRetention"
                name="recoveryRetention"
                label="Retention"
                value={formik.values.recoveryRetention ? formatLKR(formik.values.recoveryRetention) : ''}
                onChange={(e) => {
                  const parsed = parseLKR(e.target.value);
                  formik.setFieldValue('recoveryRetention', parsed);
                }}
                error={formik.touched.recoveryRetention && Boolean(formik.errors.recoveryRetention)}
                helperText={formik.touched.recoveryRetention && formik.errors.recoveryRetention}
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
              <Card 
                elevation={0}
                sx={{ 
                  mt: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #3b82f611 0%, #3b82f605 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.1)'
                }}
              >
                <CardContent sx={{ py: 2 }}>
                  <Typography 
                    variant="subtitle1" 
                    color="primary.main" 
                    sx={{ fontWeight: 600 }}
                  >
                    Net Payment Amount: {formatLKR(netPayment)}
                  </Typography>
                </CardContent>
              </Card>
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
                Save Bill Payment Details
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default BillPaymentsForm;