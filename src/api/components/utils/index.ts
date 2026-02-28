export function createPageUrl(pageName: string) {
    return '/' + pageName.replace(/ /g, '-');
}

export function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}