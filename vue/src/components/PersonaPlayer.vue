<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { unsafe_createClientWithApiKey } from '@anam-ai/js-sdk'
import type { AnamClient } from '@anam-ai/js-sdk'
import { AnamEvent } from '@anam-ai/js-sdk/dist/module/types'

const API_KEY = import.meta.env.VITE_API_KEY
const PERSONA_ID = import.meta.env.VITE_PERSONA_ID

const isStreaming = ref(false)
const isLoading = ref(false)
let anamClient: AnamClient | null = null

const videoRef = ref<HTMLVideoElement | null>(null)
const audioRef = ref<HTMLAudioElement | null>(null)
const videoId = 'video-id'
const audioId = 'audio-id'

const startStreaming = async () => {
  isLoading.value = true
  try {
    anamClient = unsafe_createClientWithApiKey(API_KEY, {
      personaId: PERSONA_ID
    })
    anamClient.addListener(AnamEvent.VIDEO_PLAY_STARTED, () => {
      isLoading.value = false
      isStreaming.value = true
    })
    if (videoRef.value && audioRef.value) {
      // Temporarily add IDs to the elements
      videoRef.value.id = videoId
      audioRef.value.id = audioId

      await anamClient.streamToVideoAndAudioElements(videoId, audioId)
    }
  } catch (error) {
    console.error('Error starting stream:', error)
    isLoading.value = false
  }
}

const stopStreaming = () => {
  if (anamClient && isStreaming.value) {
    anamClient.stopStreaming()
    isStreaming.value = false
  }
}

onUnmounted(() => {
  stopStreaming()
})

// Expose the styles to the custom element
const style = `
  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .items-center { align-items: center; }
  .relative { position: relative; }
  .bg-slate-700 { background-color: #334155; }
  .border-none { border: none; }
  .w-[512px] { width: 512px; }
  .h-[512px] { height: 512px; }
  .rounded-xl { border-radius: 0.75rem; }
  .overflow-hidden { overflow: hidden; }
  .object-cover { object-fit: cover; }
  .absolute { position: absolute; }
  .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
  .animate-spin { animation: spin 1s linear infinite; }
  .rounded-full { border-radius: 9999px; }
  .h-32 { height: 8rem; }
  .w-32 { width: 8rem; }
  .border-t-2 { border-top-width: 2px; }
  .border-b-2 { border-bottom-width: 2px; }
  .border-white { border-color: #ffffff; }
  .mt-4 { margin-top: 1rem; }
  .px-4 { padding-left: 1rem; padding-right: 1rem; }
  .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
  .bg-green-500 { background-color: #22c55e; }
  .bg-red-500 { background-color: #ef4444; }
  .text-white { color: #ffffff; }
  .rounded { border-radius: 0.25rem; }
  .hover:bg-green-600:hover { background-color: #16a34a; }
  .hover:bg-red-600:hover { background-color: #dc2626; }
  .transition-colors { transition-property: background-color, border-color, color, fill, stroke; }
  .duration-300 { transition-duration: 300ms; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`

defineExpose({ style })
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="relative bg-slate-700 border-none w-[512px] h-[512px] rounded-xl overflow-hidden">
      <video
        v-show="!isLoading && isStreaming"
        id="video-id"
        ref="videoRef"
        class="object-cover w-full h-full"
        muted
        autoplay
        playsinline
      ></video>
      <audio id="audio-id" ref="audioRef" autoplay></audio>
      <!-- Loading Spinner -->
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
        <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    </div>
    <button
      v-if="!isStreaming"
      @click="startStreaming"
      class="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
    >
      Start Streaming
    </button>
    <button
      v-else
      @click="stopStreaming"
      class="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
    >
      Stop Streaming
    </button>
  </div>
</template>
