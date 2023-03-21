import { Transform } from "class-transformer";
import { IsDateString, IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {
    @IsOptional()
    @IsPositive()
    limit?: number;

    @IsOptional()
    @IsPositive()
    offset?: number;

    @IsOptional()
    keyword?: string;

    @IsOptional()
    @Transform(({ value }) => {
        const [day, month, year] = value.split('-');
        return new Date(`${month}-${day}-${year}`);
    })
    start?: string;

    @IsOptional()
    @Transform(({ value }) => {
        const [day, month, year] = value.split('-');
        return new Date(`${month}-${day}-${year}`);
    })
    end?: string;
}
