<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center">
        <div class="max-w-md w-full mx-4">
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                        <UIcon name="i-heroicons-lock-closed" class="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900">Admin Login</h2>
                    <p class="text-gray-600 mt-2">Bitte melden Sie sich an, um fortzufahren</p>
                </div>

                <UAlert v-if="error" color="red" variant="soft" icon="i-heroicons-exclamation-triangle" class="mb-4">
                    {{ error }}
                </UAlert>

                <form @submit.prevent="handleLogin" class="space-y-6"
                    style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <div>
                        <UFormGroup label="Benutzername" required>
                            <UInput v-model="username" type="text" placeholder="Admin Benutzername" />
                        </UFormGroup>
                    </div>

                    <div>
                        <UFormGroup label="Passwort" required>
                            <UInput v-model="password" type="password" placeholder="••••••••" />
                        </UFormGroup>
                    </div>

                    <UButton type="submit" block :loading="isLoading">
                        Anmelden
                        <template #trailing>
                            <UIcon name="i-heroicons-arrow-right" class="h-5 w-5" />
                        </template>
                    </UButton>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
const username = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
    try {
        isLoading.value = true;
        error.value = '';

        const response = await $fetch('/api/admin/auth/login', {
            method: 'POST',
            body: {
                username: username.value,
                password: password.value
            }
        });

        if (response.success) {
            // Weiterleitung zur Admin-Seite
            navigateTo('/admin/flights');
        }
    } catch (err) {
        console.error('Login error:', err);
        error.value = err.data?.message || 'Ein Fehler ist aufgetreten';
    } finally {
        isLoading.value = false;
    }
};
</script>