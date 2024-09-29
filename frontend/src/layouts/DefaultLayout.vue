<template>
  <v-app>
    <v-navigation-drawer location="left" permanent app v-model="drawer" >
      <template v-slot:prepend>
        <v-list-item lines="two" prepend-avatar="https://randomuser.me/api/portraits/women/81.jpg" subtitle="Logged in"
          title="Jane Smith"></v-list-item>
      </template>
      <v-divider></v-divider>
      <v-list density="compact" nav >
        <v-list-item prepend-icon="mdi-home-city" title="Home" value="home" to="/"></v-list-item>
        <v-list-item prepend-icon="mdi-account" title="User Detail" value="account" to="/createuser"></v-list-item>
        <v-list-item prepend-icon="mdi-account-group-outline" title="List Users" value="users"
          to="/users"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>CPD</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout" color="error">Logout</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script setup lang="ts">

// console.log('API URL:', process.env.VUE_APP_API_URL);
import router from '@/router';
import { ref } from 'vue';

const drawer = ref(true);
const valid = ref(false);
const formData = ref({
  email: '',
  password: '',
});

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  valid.value = false;
  formData.value = { email: '', password: '' };
  router.push({ path: '/login' });
  // Clear any existing error messages
}

</script>
