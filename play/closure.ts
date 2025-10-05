function calculator(val: number) {
    return {
        add(other: number) {
            val += other;
        },
        subtract(other: number) {
            val -= other;
        },
        multiply(other: number) {
            val *= other;
        },
        divide(other: number) {
            val /= other;
        },
        get() {
            return val;
        }
    }
}

const two = calculator(2);
two.add(4);
two.subtract(2);
two.multiply(8);
console.log(two.get());