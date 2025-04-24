
import { BaseNLPService } from './baseService';

export class BatchService extends BaseNLPService {
  async submitBatch(jobs: any[], options?: { window?: string }): Promise<any> {
    this.checkConfiguration();

    try {
      const fileContent = jobs.map(job => JSON.stringify(job)).join('\n');
      const fileBlob = new Blob([fileContent], { type: 'application/jsonl' });
      const formData = new FormData();
      formData.append('purpose', 'batch');
      formData.append('file', fileBlob);

      const fileResponse = await fetch(`${this.baseUrl}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      if (!fileResponse.ok) {
        throw new Error(`File upload error: ${fileResponse.statusText}`);
      }

      const fileData = await fileResponse.json();
      
      const batchResponse = await fetch(`${this.baseUrl}/batches`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input_file_id: fileData.id,
          endpoint: '/v1/chat/completions',
          completion_window: options?.window || '24h'
        })
      });

      if (!batchResponse.ok) {
        throw new Error(`Batch creation error: ${batchResponse.statusText}`);
      }

      return await batchResponse.json();
    } catch (error) {
      console.error('Error submitting batch:', error);
      throw error;
    }
  }
}
