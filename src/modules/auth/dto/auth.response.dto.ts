import {IsNotEmpty} from 'class-validator';

export class AuthResponseDto {
  @IsNotEmpty()
  readonly accessToken: string;
}
