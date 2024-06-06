export const devLog = (title: string, data: any) => {
    let env: string = process.env.NODE_ENV || '';

    if(!["production", "staging"].includes(env)){
        console.log(title, data)
        console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - ')
    }
}