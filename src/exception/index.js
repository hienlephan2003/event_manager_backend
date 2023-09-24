exports.handleExceptionInResponse = (res,err) => {
    console.log(err);
    if(err instanceof Error)
    {
        return res.status(400).json(
            {
                message: err.message
            }
        )
    }

    return res.sendStatus(400);  
}