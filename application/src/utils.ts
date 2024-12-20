import { getDownloadURL, getStorage, ref } from "firebase/storage"
import AsyncStorage from '@react-native-async-storage/async-storage'

import { Audio } from 'expo-av'

export const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const URL_CACHE_KEY = 'cached_storage_urls'

async function getCachedUrls(): Promise<Record<string, string>> {
    try {
        const cached = await AsyncStorage.getItem(URL_CACHE_KEY)
        return cached ? JSON.parse(cached) : {}
    } catch {
        return {}
    }
}

async function setCachedUrl(gsPath: string, url: string) {
    try {
        const cache = await getCachedUrls()
        cache[gsPath] = url
        await AsyncStorage.setItem(URL_CACHE_KEY, JSON.stringify(cache))
    } catch (error) {
        console.error('Error caching URL:', error)
    }
}

export const getStorageUrl = async (gsPath: string): Promise<string> => {
    const cache = await getCachedUrls()
    if (cache[gsPath]) {
        return cache[gsPath]
    }

    // not in cache => fetch
    const storage = getStorage()
    const fileRef = ref(storage, gsPath)
    const url = await getDownloadURL(fileRef)
    await setCachedUrl(gsPath, url)
    return url
}

export const playSound = async () => {
    try {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/sounds/page-flip-47177.mp3')
        )
        await sound.playAsync()
    } catch (error) {
        console.log('Error playing sound:', error)
    }
}