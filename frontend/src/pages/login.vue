<template>
  <v-container class="d-flex justify-center align-center mycontainer" fill-height>
    <v-card class="pa-5 mx-auto" max-width="700">
      <img src="https://th.bing.com/th/id/R.435fc4f5aaec444bb94b2ffa6b1a3c66?rik=vFEconPrNuKYuQ&pid=ImgRaw&r=0&sres=1&sresct=1"
        alt="Logo" style="height: 150px; display: block; margin: 0 auto 20px;" />
      <v-card-title primary-title class="text-center">
        HRCPD <br />
        <span class="text-subtitle-1">ប្រព័ន្ធគ្រប់គ្រងបុគ្គលិក</span>
      </v-card-title>
      <v-form v-model="valid" @submit.prevent="login">
        <v-text-field label="អ៊ីម៉ែល" v-model="formData.email" :rules="[rules.required, rules.email]" required />
        <v-text-field label="លេខសំងាត់" v-model="formData.password" type="password" :rules="[rules.required]" required />
      </v-form> <v-card-actions> <v-btn :disabled="loading" color="primary" @click="login" variant="outlined"> <template
            v-if="!loading">ចូលប្រើប្រាស់</template>
          <template v-else>
            <v-progress-circular indeterminate size="25" color="primary"></v-progress-circular>
          </template>
        </v-btn> <v-spacer /> <v-btn :disabled="loading" to="/register">បង្កើតគណនីថ្មី</v-btn>
      </v-card-actions>
      <v-alert v-if="checkError" type="error" dismissible> មានបញ្ហា: {{ errorMessage }} </v-alert> </v-card>
  </v-container>
</template>
<style>
.mycontainer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

}
</style>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// Initialize router and refs
const router = useRouter();
const valid = ref(false);
const loading = ref(false);
const checkError = ref(false);
const errorMessage = ref("");

// Form data for login
const formData = ref({
  email: "",
  password: "",
});

// Validation rules
const rules = {
  required: (value) => !!value || "តម្រូវការ",
  email: (value) => /.+@.+\..+/.test(value) || "អ៊ីម៉េលត្រឹមត្រូវ",
};

// Base URL from environment variables
const baseUrl = import.meta.env.VITE_API_URL;

// Login method
const login = async () => {
  // Stop if form is invalid
  if (!valid.value) return;

  // Start loading and reset error state
  loading.value = true;
  checkError.value = false;
  errorMessage.value = "";

  try {
    // Optional delay for UX purposes
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    // Send login request to the server
    const response = await axios.post(
      `${baseUrl}/api/auth/login`,
      formData.value
    );

    // Handle response and save user/token data
    const { token, user } = response.data;
    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/");
    } else {
      throw new Error("Invalid login response.");
    }
  } catch (error) {
    // Capture and display specific errors
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message || "អ៊ីម៉ែល-លេខសំងាត់មិនត្រឹមត្រូវ!";
    }
    else {
      errorMessage.value = "អ៊ីម៉ែល-លេខសំងាត់មិនត្រឹមត្រូវ!";
    }
    checkError.value = true;
  } finally {
    // Reset loading state after request completion
    loading.value = false;
  }
};

</script>

<route lang="yaml">
meta:
  layout: auth
</route>
