import { prisma } from '@/lib/prisma'

type NotificationType =
  | 'follow'
  | 'like'
  | 'comment'
  | 'workshop_invite'
  | 'workshop_join'
  | 'workshop_leave'
  | 'poem_published'
  | 'poem_shared'
  | 'feedback_received'

interface CreateNotificationParams {
  type: NotificationType
  message: string
  userId: string
  userFromId?: string
  poemId?: string
  workshopId?: string
}

export async function createNotification({
  type,
  message,
  userId,
  userFromId,
  poemId,
  workshopId,
}: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        type,
        message,
        userId,
        userFromId,
        poemId,
        workshopId,
      },
    })
    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    return null
  }
}

export async function createFollowNotification(followerId: string, followingId: string) {
  const follower = await prisma.user.findUnique({
    where: { id: followerId },
    select: { name: true },
  })

  if (!follower) return null

  return createNotification({
    type: 'follow',
    message: `${follower.name} started following you`,
    userId: followingId,
    userFromId: followerId,
  })
}

export async function createLikeNotification(userId: string, poemId: string) {
  const [user, poem] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    }),
    prisma.poem.findUnique({
      where: { id: poemId },
      select: { title: true, authorId: true },
    }),
  ])

  if (!user || !poem) return null

  return createNotification({
    type: 'like',
    message: `${user.name} liked your poem`,
    userId: poem.authorId,
    userFromId: userId,
    poemId,
  })
}

export async function createCommentNotification(
  userId: string,
  poemId: string,
  comment: string
) {
  const [user, poem] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    }),
    prisma.poem.findUnique({
      where: { id: poemId },
      select: { title: true, authorId: true },
    }),
  ])

  if (!user || !poem) return null

  return createNotification({
    type: 'comment',
    message: `${user.name} commented on your poem: "${comment}"`,
    userId: poem.authorId,
    userFromId: userId,
    poemId,
  })
}

export async function createWorkshopInviteNotification(
  userId: string,
  workshopId: string
) {
  const [user, workshop] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    }),
    prisma.workshop.findUnique({
      where: { id: workshopId },
      select: { name: true },
    }),
  ])

  if (!user || !workshop) return null

  return createNotification({
    type: 'workshop_invite',
    message: `${user.name} invited you to join the workshop "${workshop.name}"`,
    userId,
    workshopId,
  })
}

export async function createWorkshopJoinNotification(
  userId: string,
  workshopId: string
) {
  const [user, workshop] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    }),
    prisma.workshop.findUnique({
      where: { id: workshopId },
      select: { name: true, creatorId: true },
    }),
  ])

  if (!user || !workshop) return null

  return createNotification({
    type: 'workshop_join',
    message: `${user.name} joined your workshop "${workshop.name}"`,
    userId: workshop.creatorId,
    userFromId: userId,
    workshopId,
  })
}

export async function createWorkshopLeaveNotification(
  userId: string,
  workshopId: string
) {
  const [user, workshop] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    }),
    prisma.workshop.findUnique({
      where: { id: workshopId },
      select: { name: true, creatorId: true },
    }),
  ])

  if (!user || !workshop) return null

  return createNotification({
    type: 'workshop_leave',
    message: `${user.name} left your workshop "${workshop.name}"`,
    userId: workshop.creatorId,
    userFromId: userId,
    workshopId,
  })
}

export async function createPoemPublishedNotification(poemId: string) {
  const poem = await prisma.poem.findUnique({
    where: { id: poemId },
    select: { title: true, authorId: true },
  })

  if (!poem) return null

  return createNotification({
    type: 'poem_published',
    message: `Your poem "${poem.title}" has been published`,
    userId: poem.authorId,
    poemId,
  })
}

export async function createPoemSharedNotification(
  userId: string,
  poemId: string,
  sharedWithId: string
) {
  const [user, poem, sharedWith] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    }),
    prisma.poem.findUnique({
      where: { id: poemId },
      select: { title: true },
    }),
    prisma.user.findUnique({
      where: { id: sharedWithId },
      select: { name: true },
    }),
  ])

  if (!user || !poem || !sharedWith) return null

  return createNotification({
    type: 'poem_shared',
    message: `${user.name} shared their poem "${poem.title}" with you`,
    userId: sharedWithId,
    userFromId: userId,
    poemId,
  })
}

export async function createFeedbackReceivedNotification(
  userId: string,
  poemId: string,
  feedback: string
) {
  const [user, poem] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    }),
    prisma.poem.findUnique({
      where: { id: poemId },
      select: { title: true, authorId: true },
    }),
  ])

  if (!user || !poem) return null

  return createNotification({
    type: 'feedback_received',
    message: `${user.name} provided feedback on your poem "${poem.title}": "${feedback}"`,
    userId: poem.authorId,
    userFromId: userId,
    poemId,
  })
} 