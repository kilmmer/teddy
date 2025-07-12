export class Auth {
  constructor(
    public id: number,
    public name: string,
  ) {}

  static fromEntity(entity: Auth): Auth {
    return new Auth(entity.id, entity.name);
  }

  static fromPartial(partial: Partial<Auth>): Auth {
    return new Auth(partial.id ?? 0, partial.name ?? '');
  }

  toEntity(): Auth {
    return new Auth(this.id, this.name);
  }

  toPartial(): Partial<Auth> {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
