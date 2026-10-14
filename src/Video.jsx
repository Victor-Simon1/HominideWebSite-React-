const SimpleVideo = () => 
{
    return (
        <div>
            <Thumbnail video={video} />
            <a href={video.url}>
                <h3>{video.title}</h3>
                <p>{video.description}</p>
            </a>
            <button video={video} />
        </div>
    );
};

export const VideoList = () => 
{
    const count = 0;
    let heading = "";
    if(count >0){
        const noun = count>1 ?"Videos" : "Video";
        heading = count + ' ' + noun; 
    }
     return (
        <section>
        <h2>{heading}</h2>
        {videos.map(video =>
            <SimpleVideo key={video.id} video={video} />
        )}
        </section>
    );
}

