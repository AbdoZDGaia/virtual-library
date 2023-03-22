import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsPositive()
    limit?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsPositive()
    offset?: number;

    @ApiPropertyOptional()
    @IsOptional()
    keyword?: string;

    @ApiPropertyOptional({
        description: 'Start date / ex: 30-01-2020'
      })
    @IsOptional()
    @Transform(({ value }) => {
        const [day, month, year] = value.split('-');
        return new Date(`${month}-${day}-${year}`);
    })
    start?: string;

    @ApiPropertyOptional({
        description: 'End date / ex: 30-01-2020'
      })
    @IsOptional()
    @Transform(({ value }) => {
        const [day, month, year] = value.split('-');
        return new Date(`${month}-${day}-${year}`);
    })
    end?: string;
}
