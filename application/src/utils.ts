import { getDownloadURL, getStorage, ref } from "firebase/storage"

export const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export const getStorageUrl = async (gsPath: string) => {
    const storage = getStorage()
    const fileRef = ref(storage, gsPath)
    return await getDownloadURL(fileRef)
}