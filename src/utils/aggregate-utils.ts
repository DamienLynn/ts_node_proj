export const aggregatePaginate = async (
        repo: any, 
        pipeline: Array<object> = [],
        page_no: string = '0',
        page_size: string = '0',
        lookupPipeline: Array<object> = [],
    ) => {
        let p_number : number = parseInt(page_no) | 0;
        let p_size : number = parseInt(page_size) | 0;
        let total_items : number = 0;
        let total_pages : number = 0;

        if(page_no && p_number){
            let countData = await repo.aggregate([...pipeline, { '$count': 'rows'}]).toArray();

            total_items = countData.length !== 0 ? countData[0].rows : 0;
            total_pages = Math.ceil(total_items / p_size);
            const skip = p_size * (p_number - 1);

            pipeline.push(
                { $skip: skip },
                { $limit: p_size },
            )
        }
        const data = await repo.aggregate([...pipeline, ...lookupPipeline]).toArray();

        return {
            data,
            meta : {
                total_items,
                total_pages,
                current_page: page_no,
            },
        }
} 