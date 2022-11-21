
interface String {
    replaceAt(index: number, replacement: string): string
}

String.prototype.replaceAt = function (index: number, replacement: string) {
    if (index >= this.length) {
        return this.valueOf();
    }

    return this.substring(0, index) + replacement + this.substring(index + 1);
}



export {}