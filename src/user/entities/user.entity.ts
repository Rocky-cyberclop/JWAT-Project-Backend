import * as bcrypt from 'bcrypt';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Gender } from '../enums/gender.enum';

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, unique: true })
    fullName: string;

    @Column({ length: 12, unique: true })
    phoneNumber: string;

    @Column({ length: 100, unique: true })
    email: string;

    @Column({
        type: 'enum',
        enum: Gender,
        default: Gender.OTHER,
    })
    gender: Gender;

    @Column({ type: 'date' })
    dob: Date;

    @Column({ length: 255 })
    address: string;

    @Column({ length: 50, unique: true })
    username: string;

    @Column({ length: 255 })
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ default: false })
    isDeleted: boolean;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(
                this.password,
                salt,
            );
        }
    }

    async comparePassword(
        attempt: string,
    ): Promise<boolean> {
        return bcrypt.compare(
            attempt,
            this.password,
        );
    }
}
