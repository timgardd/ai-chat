import { prisma } from '@/lib/prisma';

export async function getConversations() {
  return prisma.conversation.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getConversationMessages(conversationId: string) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function createConversation(title: string) {
  return prisma.conversation.create({
    data: { title },
  });
}

export async function ensureConversation(id: string, title = 'New Chat') {
  return prisma.conversation.upsert({
    where: { id },
    update: {},
    create: { id, title },
  });
}


export async function renameConversation(id: string, title: string) {
  return prisma.conversation.update({
    where: { id },
    data: { title },
  });
}

export async function deleteConversation(id: string) {
  return prisma.conversation.delete({
    where: { id },
  });
}

export async function createMessage({
  role,
  content,
  conversationId,
}: {
  role: string;
  content: string;
  conversationId: string;
}) {
  return prisma.message.create({
    data: { role, content, conversationId },
  });
}
