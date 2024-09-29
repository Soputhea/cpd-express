<template>
  <v-container>
    <v-card class="pa-5 mx-auto" max-width="500">
      <v-card-title primary-title>
        Login
      </v-card-title>
      <v-form v-model="valid">
        <v-text-field label="Email" v-model="formData.email" :rules="[rules.required, rules.email]" required />
        <v-text-field label="Password" v-model="formData.password" type="password" :rules="[rules.required]" required />
      </v-form>
      <v-card-actions>
        <v-btn :disabled="loading" color="primary" @click="login" variant="outlined">
          <template v-if="!loading">Login</template>
          <template v-else>
            <v-progress-circular indeterminate size="25" color="dark"></v-progress-circular>
          </template>
        </v-btn>
        <v-spacer />
        <v-btn :disabled="loading" to="/register">Register account</v-btn>
      </v-card-actions>
      <v-alert v-if="checkError" color="error"> Login failed. Please try again.</v-alert>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
const baseUrl = `${import.meta.env.VITE_API_URL}`;

const router = useRouter();
const valid = ref(false);
const loading = ref(false);
const checkError = ref(false);

// Form data
const formData = ref({
  email: '',
  password: '',
});

// Validation rules
const rules = {
  required: (value) => !!value || 'Required.',
  email: (value) => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
};

const login = async () => {
  if (!valid.value) return;
  loading.value = true;
  checkError.value = false;
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await axios.post(`${baseUrl}/api/auth/login`, formData.value);
    const data = response.data;
    if (data.token && data.user) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      checkError.value = false; // Clear error message after successful login
      router.push('/');
    }
    loading.value = false;
    checkError.value = true;
  } catch (error) {
    console.error('Error during login:', error);
    checkError.value = true;
    loading.value = false;
  }
};

console.log(baseUrl)

</script>
