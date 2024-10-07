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

    const [videoStream, audioStream] = await anamClient.stream()

    if (videoRef.value && videoStream) {
      videoRef.value.srcObject = videoStream
    }
    if (audioRef.value && audioStream) {
      audioRef.value.srcObject = audioStream
    }

    // Start playing the streams
    await videoRef.value?.play()
    await audioRef.value?.play()

  } catch (error) {
    console.error('Error starting stream:', error)
    isLoading.value = false
  }
}

const stopStreaming = () => {
  if (anamClient && isStreaming.value) {
    anamClient.stopStreaming()
    isStreaming.value = false
    // Clear the srcObject of video and audio elements
    if (videoRef.value) videoRef.value.srcObject = null
    if (audioRef.value) audioRef.value.srcObject = null
  }
}

onUnmounted(() => {
  stopStreaming()
})
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="relative bg-slate-700 border-none w-[512px] h-[512px] rounded-xl overflow-hidden">
      <video v-show="!isLoading && isStreaming" id="video-id" ref="videoRef" class="object-cover w-full h-full" muted
        autoplay playsinline></video>
      <audio id="audio-id" ref="audioRef" autoplay></audio>
      <!-- Loading Spinner -->
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
        <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    </div>
    <button v-if="!isStreaming" @click="startStreaming"
      class="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300">
      Start Streaming
    </button>
    <button v-else @click="stopStreaming"
      class="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300">
      Stop Streaming
    </button>
  </div>
</template>
