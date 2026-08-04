import axiosClient from '@/services/axiosClient';
import type { ChatResponseDTO } from '@/types/chat.types.ts';

export const chatService = {
  /**
   * Gửi tin nhắn tới chatbot.
   * Lưu ý: axiosClient interceptor đã unwrap response.data ở tầng axios,
   * nhưng backend vẫn bọc thêm 1 lớp RestResponse ({statusCode, message, data}) qua @ApiMessage,
   * nên response ở đây có dạng IBackendRes<ChatResponseDTO> chứ KHÔNG phải ChatResponseDTO trực tiếp.
   */
  sendMessage: async (sessionId: string, message: string): Promise<IBackendRes<ChatResponseDTO>> => {
    const response = await axiosClient.post('/api/v1/chat/message', { sessionId, message });
    return response as unknown as IBackendRes<ChatResponseDTO>;
  },
};
