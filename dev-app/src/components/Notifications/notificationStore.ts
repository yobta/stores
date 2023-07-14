import { createStore } from '@yobta/stores'
import { useStore } from '@yobta/stores/react'

export interface NotificationLike {
  message: string
}

const notificationStore = createStore<NotificationLike[]>([])

export const pushNotification = (
  ...notifications: NotificationLike[]
): void => {
  const last = notificationStore.last()
  const newNotifications = notifications.filter(
    (righ) => !last.some((left) => left.message === righ.message)
  )
  notificationStore.next([...last, ...newNotifications])
}

export const popNotification = (): void => {
  const state = notificationStore.last().slice(1)
  notificationStore.next(state)
}

const getServerSnapshot = (): NotificationLike[] => []

export const useNotification = (): NotificationLike | undefined => {
  const notifications = useStore(notificationStore, { getServerSnapshot })
  return notifications[0]
}
