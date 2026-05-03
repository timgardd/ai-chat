"use server";

import { createConversation, deleteConversation, renameConversation } from '@/db/queries';
import { revalidatePath } from 'next/cache';

export async function addChatAction(title: string) {
  const chat = await createConversation(title);
  revalidatePath('/', 'layout');
  return chat;
}

export async function removeChatAction(id: string) {
  await deleteConversation(id);
  revalidatePath('/', 'layout');
}

export async function renameChatAction(id: string, title: string) {
  await renameConversation(id, title);
  revalidatePath('/', 'layout');
}
