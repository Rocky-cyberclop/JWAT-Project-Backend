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

  async ensureIndexExists() {
    try {
      await this.elasticsearchService.indices.get({ index: this.index });
    } catch (error) {
      if (error.meta.statusCode === 404) {
        await this.elasticsearchService.indices.create({ index: this.index });
      } else {
        throw error;
      }
    }
  }

  async search(text: string) {
    await this.ensureIndexExists();
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

  async update(blog: Blog) {
    const newBody: BlogSearchBody = {
      id: blog.id,
      title: blog.title,
      content: blog.content,
    };
    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      const escapedValue = typeof value === 'string' ? value.replace(/'/g, "\\'") : value;
      return `${result} ctx._source.${key}='${escapedValue}';`;
    }, '');
    return this.elasticsearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: blog.id,
          },
        },
        script: {
          source: script,
          lang: 'painless',
        },
      },
    });
  }

  async remove(blog: Blog) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: blog.id,
          },
        },
      },
    });
  }
}
