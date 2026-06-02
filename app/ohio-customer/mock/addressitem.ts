import { ProvinceResponseDto, WardResponseDto, ProvinceListResponseDto, WardListResponseDto, AdministrativeUnitResponseDto } from "@/types/addressitem";

export const mockAdministrativeUnit: AdministrativeUnitResponseDto = {
    id: "1",
    fullName: "Thành phố trực thuộc trung ương",
    fullNameEn: "Municipality",
    shortName: "Thành phố",
    shortNameEn: "City",
    codeName: "thanh_pho_truc_thuoc_trung_uong",
    codeNameEn: "municipality"
};

export const mockAdministrativeUnitDistrict: AdministrativeUnitResponseDto = {
    id: "2",
    fullName: "Quận",
    fullNameEn: "District",
    shortName: "Quận",
    shortNameEn: "District",
    codeName: "quan",
    codeNameEn: "district"
};

export const mockProvinces: ProvinceResponseDto[] = [
    {
        code: "01",
        name: "Hà Nội",
        nameEn: "Ha Noi",
        fullName: "Thành phố Hà Nội",
        fullNameEn: "Ha Noi City",
        codeName: "ha_noi",
        administrativeUnit: mockAdministrativeUnit
    },
    {
        code: "79",
        name: "Hồ Chí Minh",
        nameEn: "Ho Chi Minh",
        fullName: "Thành phố Hồ Chí Minh",
        fullNameEn: "Ho Chi Minh City",
        codeName: "ho_chi_minh",
        administrativeUnit: mockAdministrativeUnit
    },
    {
        code: "48",
        name: "Đà Nẵng",
        nameEn: "Da Nang",
        fullName: "Thành phố Đà Nẵng",
        fullNameEn: "Da Nang City",
        codeName: "da_nang",
        administrativeUnit: mockAdministrativeUnit
    }
];

export const mockWards: WardResponseDto[] = [
    {
        code: "00001",
        name: "Phúc Xá",
        nameEn: "Phuc Xa",
        fullName: "Phường Phúc Xá",
        fullNameEn: "Phuc Xa Ward",
        codeName: "phuc_xa",
        provinceCode: "01",
        provinceName: "Hà Nội",
        provinceFullName: "Thành phố Hà Nội",
        administrativeUnit: mockAdministrativeUnitDistrict
    },
    {
        code: "00004",
        name: "Trúc Bạch",
        nameEn: "Truc Bach",
        fullName: "Phường Trúc Bạch",
        fullNameEn: "Truc Bach Ward",
        codeName: "truc_bach",
        provinceCode: "01",
        provinceName: "Hà Nội",
        provinceFullName: "Thành phố Hà Nội",
        administrativeUnit: mockAdministrativeUnitDistrict
    },
    {
        code: "26734",
        name: "Bến Nghé",
        nameEn: "Ben Nghe",
        fullName: "Phường Bến Nghé",
        fullNameEn: "Ben Nghe Ward",
        codeName: "ben_nghe",
        provinceCode: "79",
        provinceName: "Hồ Chí Minh",
        provinceFullName: "Thành phố Hồ Chí Minh",
        administrativeUnit: mockAdministrativeUnitDistrict
    },
    {
        code: "26737",
        name: "Bến Thành",
        nameEn: "Ben Thanh",
        fullName: "Phường Bến Thành",
        fullNameEn: "Ben Thanh Ward",
        codeName: "ben_thanh",
        provinceCode: "79",
        provinceName: "Hồ Chí Minh",
        provinceFullName: "Thành phố Hồ Chí Minh",
        administrativeUnit: mockAdministrativeUnitDistrict
    },
    {
        code: "20197",
        name: "Hải Châu I",
        nameEn: "Hai Chau I",
        fullName: "Phường Hải Châu I",
        fullNameEn: "Hai Chau I Ward",
        codeName: "hai_chau_i",
        provinceCode: "48",
        provinceName: "Đà Nẵng",
        provinceFullName: "Thành phố Đà Nẵng",
        administrativeUnit: mockAdministrativeUnitDistrict
    }
];

export const mockProvinceListResponse: ProvinceListResponseDto = {
    items: mockProvinces,
    paginationRequest: {
        pageSize: 10,
        pageIndex: 1
    },
    totalCount: mockProvinces.length,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
};

export const mockWardListResponse: WardListResponseDto = {
    items: mockWards,
    paginationRequest: {
        pageSize: 10,
        pageIndex: 1
    },
    totalCount: mockWards.length,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
};
