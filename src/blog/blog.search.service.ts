import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { BlogSearchBody } from './dto/blog-index-search.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogSearchService {
  private index = 'blogs';
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexBlog(blog: Blog) {
    return this.elasticsearchService.index<BlogSearchBody>({
      index: this.index,
      body: {
        id: blog.id,
        title: blog.title,
        content: blog.content,
      },
    });
  }

  async search(text: string) {
    const result = await this.elasticsearchService.search<any>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['title', 'content'],
          },
        },
      },
    });
    const hits = result.hits.hits;
    return hits.map((item) => item._source);
  }
}
