<template>
  <UApp class="">
    <div class="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
      <NuxtPage />
    </div>
    <!-- Footer -->
    <footer class="w-full bg-blue-950 text-white border-t border-blue-900">
      <div class="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row md:justify-between gap-8">
        <!-- Navigation -->
        <div>
          <div class="font-bold text-lg mb-3">ATA - Aladin Travel Agency</div>
          <ul class="space-y-2">
            <li><a href="https://ata-europe.com/services/" target="_blank" rel="noopener"
                class="hover:text-blue-300 transition">Services</a></li>
            <li><a href="https://ata-europe.com/blog-and-article/" target="_blank" rel="noopener"
                class="hover:text-blue-300 transition">Blog & Artikel</a></li>
            <li><a href="https://ata-europe.com/contact-us/" target="_blank" rel="noopener"
                class="hover:text-blue-300 transition">Kontakt</a></li>
            <li><a href="https://ata-europe.com/about-us/" target="_blank" rel="noopener"
                class="hover:text-blue-300 transition">Über uns</a></li>
            <li><a href="https://ata-europe.com/privacy-policy/" target="_blank" rel="noopener"
                class="hover:text-blue-300 transition">Datenschutz</a></li>
          </ul>
        </div>
        <!-- Social Media -->
        <div class="flex flex-col gap-3">
          <div class="font-bold text-lg mb-3">Folge uns</div>
          <div class="flex gap-4 text-2xl">
            <a href="https://x.com/AladinTA" target="_blank" rel="noopener" aria-label="X / Twitter"
              class="hover:text-blue-300 transition">
              <UIcon name="i-simple-icons-x" />
            </a>
            <a href="https://www.facebook.com/Aladintravel" target="_blank" rel="noopener" aria-label="Facebook"
              class="hover:text-blue-300 transition">
              <UIcon name="i-simple-icons-facebook" />
            </a>
            <a href="https://www.instagram.com/aladintravel/" target="_blank" rel="noopener" aria-label="Instagram"
              class="hover:text-blue-300 transition">
              <UIcon name="i-simple-icons-instagram" />
            </a>
            <a href="https://www.linkedin.com/authwall?trkInfo=AQGcDvQ1TqYPHQAAAZb6HpdYxsbwhJAVsIbbdZzeqZhXQEbgiSwIv6sIoEiN6g0YPoD5H8tdQufrAeKlTuZplkIuCkH1ORylNxZrjPIJuOvZL-L0XuRGY6K1_T4AwSfOE378q38=&original_referer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fata-aladin-travel-agency-2110b463%2F%3Foriginal_referer%3D"
              target="_blank" rel="noopener" aria-label="LinkedIn" class="hover:text-blue-300 transition">
              <UIcon name="i-simple-icons-linkedin" />
            </a>
            <a href="https://www.youtube.com/channel/UCtkqjQUQ1xvQlZNHo5frDrw/videos?cbrd=1" target="_blank"
              rel="noopener" aria-label="YouTube" class="hover:text-blue-300 transition">
              <UIcon name="i-simple-icons-youtube" />
            </a>
          </div>
        </div>
      </div>
      <div class="text-center text-xs text-blue-200 py-4 border-t border-blue-900 bg-blue-950/80">
        © 2024 ATA - Aladin Travel Agency. All Rights Reserved.
      </div>
    </footer>
    <!-- WhatsApp Button -->
    <a href="https://wa.me/4369911008764" target="_blank" rel="noopener"
      class="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center w-16 h-16 transition-all duration-200 group"
      title="Jetzt via WhatsApp kontaktieren" aria-label="WhatsApp Kontakt">
      <img src="/assets/imags/whatsapp.svg" alt="WhatsApp" class="w-9 h-9" />
      <span
        class="absolute bottom-20 right-0 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none">Jetzt
        via WhatsApp kontaktieren</span>
    </a>
  </UApp>
</template>

<style>
/* Stepper Titel (alle Schritte) */
[id^="reka-stepper-item-title"] {
  color: #fff !important;
  font-weight: 700 !important;
}

/* Stepper Beschreibung (alle Schritte) */
[id^="reka-stepper-item-description"] {
  color: #bfdbfe !important;
  /* Tailwind blue-200 */
  font-weight: 400 !important;
}
</style>