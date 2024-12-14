<template>
  <v-app>
    <v-navigation-drawer location="left" permanent app v-model="drawer" class="bg-primary">
      <template v-slot:prepend>
        <v-list-item lines="two" prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
          :subtitle="userEmail"
          :title="userName" >
        </v-list-item>
      </template>
      <v-divider></v-divider>
      <v-list density="compact" nav >
        <v-list-item prepend-icon="mdi-home-city" title="ទំព័រដើម" value="home" to="/"></v-list-item>
        <!-- <v-list-item prepend-icon="mdi-account" title="User Detail" value="account" to="/createuser"></v-list-item> -->
        <v-list-item prepend-icon="mdi-account-group-outline" title="គ្រប់គ្រងអ្នកប្រើប្រាស់" value="users"
          to="/users"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>HRCPD</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout" color="error">ចាកចេញ</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
    <!-- <AppFooter /> -->
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import router from '@/router';

const drawer = ref(true);
const valid = ref(false);

// User information
const userName = ref('');
const userEmail = ref('');


// Load user data from localStorage on component mount
onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    userName.value = user.firstname + ' ' + user.lastname || 'No name available';
    userEmail.value = user.email || 'No Email Provided';
  }

});


const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push({ path: '/login' });
  // Clear any existing error messages
}

</script>


