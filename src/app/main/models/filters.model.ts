export interface Filter {
    Borough: number;
    PCN: number;
    Practice: number;
}

export interface FilterOptions {
    boroughs: BoroughMin[];
    pcNs: PCNMin[];
    practices: PracticeMin[];

}

export interface BoroughMin {
    id: number;
    name: string;
}

export interface PCNMin {
    id: number;
    name: string;
    borough: number;
}

export interface PracticeMin {
    id: number;
    name: string;
    pcN: number;
    borough: number;
}