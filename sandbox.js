const arr = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]];

function sleep() {
    return new Promise(resolve => {
        setTimeout(resolve, 1000);
    });
}


async function main() {
    await Promise.all(
        arr.map(async u => {
            await Promise.all(
                u.map(async number => {
                    await sleep();
                    console.log(number);
                })
            )
        })
    );
    console.log('done');
} main();