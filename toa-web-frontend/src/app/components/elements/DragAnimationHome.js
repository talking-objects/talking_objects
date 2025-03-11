import { useEffect, useRef } from "react";
import * as d3 from "d3"
import yaml from "js-yaml"
import { getRandomPlaceHolder } from "@/app/utils/hooks/etc";
import { useRouter } from "next/navigation";
const DragAnimationHome = ({imageData, center=false, relation=false, link=false, columnId="t", setShuffling}) => {

    const svgWrapper = useRef()
    const svgRef = useRef(null)
    const router = useRouter()
    const randomColor = () => {
      const bgColor = [
        '#FF5B1C',
        '#FEA30C',
        '#AC05F1',
        '#800020',
        '#84A6FF',
      ]
      return bgColor[Math.floor(Math.random() * bgColor.length)]
    }
  
    useEffect(() => {
      if(imageData && svgWrapper && svgRef){
        const nAimageData = [...imageData].map((v) => {
          v.ready = false
          return v;
        });
     

        let nodes = []
        let links = []
        
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        // d3.select("svg").selectAll("*").remove();
   
        svg
          .attr("viewBox", `0 0 ${svgWrapper.current.clientWidth} ${svgWrapper.current.clientHeight}`)
          .style("background", "none");

        
        const mainG = svg.append("g");
        const zoom = d3.zoom()
          .scaleExtent([0.1, 5]) // Set zoom limits
          .on("zoom", zoomed);
  
        // Apply the zoom behavior to the SVG element
        if(link){

            svg.call(zoom);
        }
           // Define the zoomed function
        function zoomed({ transform }) {
          mainG.attr("transform", transform); // Apply the transform to the group
        }
    
        const width = svg.node().clientWidth;
        const height = svg.node().clientHeight;
  
        const cSize = Math.min(width/5, 220);
     
        for(let i = 0; i < imageData.length; i++){
        
          const newNode = {
            id: imageData[i].id,
            color: `${yaml.load(imageData[i].coverimage)}` === "undefined" ? randomColor() : "#84A6FF",
            size: cSize,
            image: `${imageData[i].coverimage ? yaml.load(imageData[i].coverimage) : false}`,
            slug: imageData[i].slug,
            uuid: imageData[i].uuid,
            ...(relation && {title: imageData[i].title})
          }
  
          const newLink = {
            source: imageData[i].id,
            target: imageData[(i + 1) < imageData.length ? (i + 1) : 0].id
          }
          links.push(newLink)
          nodes.push(newNode)
        }
   
     
  
      var linkSelection = mainG
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke", link ? "black" :"none")
        .attr("stroke-width", 1);
  
      var nodeSelection = mainG
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
        .call(
          d3.drag().on("start", dragStart).on("drag", drag).on("end", dragEnd)
       

        )
        .on("mouseenter", function(d, i){
          if(center){
            if(i.id === imageData[imageData.length -1].id){

            }else{
              const titleBox = document.querySelector(`.${columnId}${i.slug}`)
              const imgBox = document.querySelector(`.img_${columnId}${i.slug}`)
              if(titleBox){
                
                // titleBox.setAttribute("display", "auto")
                titleBox.setAttribute("visibility", "visible")
                d3.select(`.img_${columnId}${i.slug}`).style("opacity", 1)
              }
            }
          }else{
            
            const titleBox = document.querySelector(`.${columnId}${i.slug}`)
            if(titleBox){
              d3.select(`.img_${columnId}${i.slug}`).style("opacity", 1)
              titleBox.setAttribute("visibility", "visible")
            }
          }
          
            
          })
          .on("mouseleave", function(d, i){
           
            const titleBox = document.querySelector(`.${columnId}${i.slug}`)
            if(titleBox){
              d3.select(`.img_${columnId}${i.slug}`).style("opacity", 0.5)
                // titleBox.setAttribute("display", "none")
                titleBox.setAttribute("visibility", "hidden")
            }
          })
  
        const imageSize = cSize 
        const ImagePos = imageSize/2
      // nodeSelection
      //   .append("rect")
      //   .attr("fill", (d) => "white")
      //   .attr("width", (d) => d.size-30)
      //   .attr("height", (d) => d.size-30)
      //   .attr("x", (d) => -ImagePos+15)
      //   .attr("y", (d) => -ImagePos+15)
      //   .attr("rx", (d) => 10)
      //   .attr("ry", (d) => 10)
      //   .on("mouseenter", function(){
      //     document.body.style.cursor ="grab"
      //   })
      //   .on("mouseleave", function(){
      //     document.body.style.cursor ="auto"
      //   })


     
        function compressImage(src, quality, callback) {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedDataUrl = canvas.toDataURL("image/jpeg", quality); // quality: 0.0 ~ 1.0
            callback(compressedDataUrl);
          };
        }
        
   
     
      nodeSelection
        // .filter((d, i) =>  d.image !== "undefined")
        .append("image")
        .attr("class", (d, i) => {
          return `img_${columnId}${d.slug}`
      })
      .attr("xlink:href", function(d){
        // const webpImagePath = `${process.env.KB_API_FILE}/${d.image.slice(7).replace(/\.\w+$/, '.webp')}`;
        // return webpImagePath;
        
        return `${process.env.KB_API_FILE}/${d.image.slice(7)}` 
        // return d.image !== "false" ? `${process.env.KB_API_FILE}/${d.image.slice(7)}` : getRandomPlaceHolder();
        
      })
      .attr("loading", "lazy") // Lazy loading
        .attr("width", (d, i) => {
          if(relation && center){
            if(i !== imageData.length -1){
              return imageSize
            }else{
              return imageSize * 1.3
            }
          }else{
            return imageSize
          }
        })
        .attr("height", (d, i) => {
          if(relation && center){
            if(i !== imageData.length -1){
              return imageSize
            }else{
              return imageSize * 1.3
            }
          }else{
            return imageSize
          }
        })
        .attr("x", (d, i) => {
          if(relation && center){
            if(i !== imageData.length -1){
              return -ImagePos
            }else{
              return -(imageSize * 1.3)/2
            }
          }else{
            return -ImagePos
          }
        }) // Adjust position
        .attr("y", (d, i) => {
          if(relation && center){
            if(i !== imageData.length -1){
              return -ImagePos
            }else{
              return -(imageSize * 1.3)/2
            }
          }else{
            return -ImagePos
          }
        }) // Adjust position
        .attr("clip-path", (d) => `inset(0% round 15px)`)
        .attr("preserveAspectRatio", "xMidYMid slice") 
        .style("opacity", 0) 
        .each(function(d, i) {
          // Dynamically add `onerror` to each image element
          this.onerror = () => {
              // Set placeholder when the image fails to load
              // nAimageData[i].ready = true
              d3.select(this).attr("xlink:href", getRandomPlaceHolder());
          };
          this.onload = () => {
            d3.select(this)
              .transition()
              .duration(1000) // 1000ms 동안 트랜지션
              .style("opacity", 0.5);
              // console.log(d, i)
              nAimageData[i].ready = true
              const allReady = nAimageData.every(v => v.ready)
              if(allReady){
                setShuffling(false)
                
              }else{
                setShuffling(true)
              }

          };
        })
        .on("mouseenter", function(d, i){
          if(relation && center){

            if(i.id === imageData[imageData.length -1].id){
              document.body.style.cursor ="auto"
            }else{
              
              document.body.style.cursor ="grab"
            }
          }else{
            document.body.style.cursor ="grab"
          }
       
        })
        .on("mouseleave", function(d, i){
          document.body.style.cursor ="auto"
        
        })
       

      if(relation){
        nodeSelection
        .append("g")
        .attr("class", (d, i) => {
            return `${columnId}${d.slug}`
        })
        .attr("visibility", "hidden")
        // .attr("display", "none")
        .each(function (d, i) {
            const group = d3.select(this);
            
            const rectElement = group
            .append("rect")
            
            // Append the text element first to measure its size
            const textElement = group
              .append("text")
              .text(`${d.title}`) // Replace "dddd" with your dynamic text if needed
              .attr("fill", "black");
            
            // Use `getBBox()` to get the text size
          
            const textSize = textElement.node().getBBox();
          
            
            rectElement
            .attr("width", textSize.width + 10) // Add some padding
            .attr("height", textSize.height + 10) // Add some padding
            .attr("fill", "white")
            .attr("x", -5 - ((textSize.width + 10)/2)) // Adjust x to position the rectangle around the text
            .attr("y", -textSize.height / 2) // Adjust y to position the rectangle around the text
            .attr("rx", () => 10)
            .attr("ry", () => 10)
            .attr("stroke", "black")
            
            // Append the rectangle and use the text size to set the dimensions
            
            // Position the text to align properly within the rectangle
            textElement.attr("x", - ((textSize.width + 10)/2)).attr("y", textSize.height / 2);
      })
      .on("mouseenter", function(d, i){
        d3.select(this).select("rect").attr("fill", "black")
        d3.select(this).select("text").attr("fill", "white")
        document.body.style.cursor ="pointer"
      })
      .on("mouseleave", function(d, i){
        d3.select(this).select("rect").attr("fill", "white")
        d3.select(this).select("text").attr("fill", "black")
        document.body.style.cursor ="auto"
      })
      .on("click", function(d, i){
        d3.select(this).select("rect").attr("fill", "white")
        d3.select(this).select("text").attr("fill", "black")
        document.body.style.cursor ="auto"
        router.push(`/objects/${String(i.uuid).slice(7)}`)
      })
      }
   
  
      var simulation = d3.forceSimulation(nodes);
  
      simulation
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("nodes", d3.forceManyBody())
        .force(
          "links",
          d3
            .forceLink(links)
            .id((d) => d.id)
            .distance((relation && center) ? width / 2.8 : width / 3)
            .strength((relation && center) ? 0.08 : 0.1)
        )
        .force("collide", d3.forceCollide().radius(d => {
          return d.size/2
        }).iterations(3))
        .on("tick", ticked);
  
      function ticked() {
        nodeSelection.attr("transform", (d, i) => {
          if(relation && center){
            if(d.id === imageData[imageData.length -1].id){
              return `translate(${width/2}, ${height/2})`
            }
          }
          
          return `translate(${d.x}, ${d.y})`
        });
  
        linkSelection
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);
      }
  
      function dragStart(event, d, i) {
        simulation.alphaTarget(0.5).restart();
        if(relation && center){
          if(d.id !== imageData[imageData.length -1].id){
            document.body.style.cursor ="grabbing"
            d.fx = d.x;
            d.fy = d.y;
          }
        }else{
          document.body.style.cursor ="grabbing"
            d.fx = d.x;
            d.fy = d.y;
        }
        
        
      }
  
      function drag(event, d) {
        if(relation && center){
          if(d.id !== imageData[imageData.length -1].id){

            d.fx = event.x;
            d.fy = event.y;
          }
        }else{
          d.fx = event.x;
          d.fy = event.y;
        }
        
      }
  
      function dragEnd(event, d) {
        simulation.alphaTarget(0);
        if(relation && center){
          if(d.id !== imageData[imageData.length -1].id){
            d.fx = null;
            d.fy = null;
            document.body.style.cursor ="grab"
          }
        }else{
          d.fx = null;
          d.fy = null;
          document.body.style.cursor ="grab"
        }
        
       
      }
      }
    }, [imageData]);
  
    return (
      <div ref={svgWrapper} className="flex-1">
        <svg ref={svgRef} className="svg">
        
        </svg>
      </div>
    );
  };

export default DragAnimationHome;