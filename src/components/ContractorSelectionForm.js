import React, { useState, useEffect } from 'react';
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
  Snackbar,
  Alert,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Save } from '@mui/icons-material';
import { formatLKR, parseLKR } from '../utils/formatters';
import { contractorService, projectService } from '../utils/api';

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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const data = await projectService.getAll();
        console.log('Fetched projects:', data); // Debug log
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from server');
        }
        if (data.length === 0) {
          console.log('No projects found in database'); // Debug log
        }
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setSnackbar({
          open: true,
          message: `Failed to fetch projects: ${error.message}`,
          severity: 'error',
        });
        setProjects([]);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const formik = useFormik({
    initialValues: {
      projectId: '',
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
    validationSchema: validationSchema.shape({
      projectId: Yup.string().required('Project is required'),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formattedValues = {
          project_id: values.projectId,
          date_awarded: values.dateAwarded ? values.dateAwarded.format('YYYY-MM-DD') : null,
          contractor_name: values.contractorName,
          contract_no: values.contractNo,
          contract_amount: parseLKR(values.contractAmount),
          vat_details: values.vatDetails,
          contract_period: values.contractPeriod,
          performance_bond_bank: values.performanceBondBank,
          performance_bond_amount: parseLKR(values.performanceBondAmount),
          performance_bond_expiry: values.performanceBondExpiry ? values.performanceBondExpiry.format('YYYY-MM-DD') : null,
        };
        
        await contractorService.create(formattedValues);
        setSnackbar({
          open: true,
          message: 'Contractor details saved successfully!',
          severity: 'success',
        });
        formik.resetForm();
      } catch (error) {
        let errorMessage = 'Failed to save contractor details';
        if (error.message.includes('foreign key constraint')) {
          errorMessage = 'Invalid project selected';
        } else if (error.message.includes('Duplicate entry')) {
          errorMessage = 'A contractor is already assigned to this project';
        }
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', pt: 1 }}>
      <Paper>
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
                Project Selection
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                id="projectId"
                name="projectId"
                label="Select Project"
                value={formik.values.projectId}
                onChange={formik.handleChange}
                error={formik.touched.projectId && Boolean(formik.errors.projectId)}
                helperText={formik.touched.projectId && formik.errors.projectId}
                disabled={isLoadingProjects}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff'
                  }
                }}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.project_no} - {project.project_description}
                  </MenuItem>
                ))}
              </TextField>
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
                disabled={isSubmitting || isLoadingProjects}
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
                {isSubmitting ? 'Saving...' : 'Save Contractor Details'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ContractorSelectionForm;