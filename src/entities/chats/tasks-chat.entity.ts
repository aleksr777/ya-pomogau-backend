import { Injectable, Scope } from '@nestjs/common';
import { ChatsRepository } from '../../datalake/chats/chats.repository';
import { MessagesRepository } from '../../datalake/messages/messages.repository';

@Injectable({ scope: Scope.TRANSIENT })
export class ChatEntity {
  private metadata: any[];
  private messages: any[];

  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly messagesRepository: MessagesRepository
  ) {
    this.metadata = [];
    this.messages = [];
  }

  async createChat() {
    console.log('Создание чата');
  }

  async findChatByParams() {
    console.log('Поиск чата по параметрам');
  }

  async findConflictingChats() {
    console.log('Поиск конфликтующих чатов чата');
  }

  async addMessage() {
    console.log('Добавить сообщение');
  }

  async closeChat() {
    console.log('Закрыть чат');
  }
}
