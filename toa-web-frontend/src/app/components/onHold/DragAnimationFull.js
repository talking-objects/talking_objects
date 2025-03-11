import { useEffect } from "react";
import * as d3 from "d3"
import yaml from "js-yaml"
import { getRandomPlaceHolder } from "@/app/utils/hooks/etc";
import { useRouter } from "next/navigation";
import { BUTTONLIST, DRAGANIMATION_CORETHEMELIST } from "@/app/constant/kirbyurl";
const DragAnimationFull = ({imageData, relation=false, link=false, setCurrentItem}) => {
    
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
      if(imageData){
        let currentCore = ""
        const clickStroke = 7
        let nodes = []
        let links = []
        
        const svg = d3.select(".svg");
        svg.selectAll("*").remove();

        
   
        svg
          .style("width", "100%")
          .style("height", "100%")
          .style("background", "none");

        
        const mainG = svg.append("g");
        const zoom = d3.zoom()
          .scaleExtent([0.1, 5]) // Set zoom limits
          .on("zoom", zoomed);
  
     
        if(link){

            svg.call(zoom);
        }
           // Define the zoomed function
        function zoomed({ transform }) {
          mainG.attr("transform", transform); // Apply the transform to the group
        }
    
        const width = svg.node().clientWidth;
        const height = svg.node().clientHeight;
  
        const cSize = width/5;

        for(let i =0; i < DRAGANIMATION_CORETHEMELIST.length; i++){
          const newNode = {
            id: DRAGANIMATION_CORETHEMELIST[i].slug,
            color: `${DRAGANIMATION_CORETHEMELIST[i].color}`,
            size: cSize * 4,
            image: `${false}`,
            slug: imageData[i].slug,
            uuid: imageData[i].slug,
            type: "parent",
            name: DRAGANIMATION_CORETHEMELIST[i].name,
            ...(relation && {title: imageData[i].title})
          }
          nodes.push(newNode)
        }
     
        for(let i = 0; i < imageData.length; i++){
          
          const newNode = {
            id: imageData[i].id,
            color: `${yaml.load(imageData[i].coverimage)}` === "undefined" ? randomColor() : "black",
            size: cSize,
            image: `${imageData[i].coverimage ? yaml.load(imageData[i].coverimage) : false}`,
            slug: imageData[i].slug,
            uuid: imageData[i].uuid,
            type: "item",
            corethemes: imageData[i].coretheme.split(",").map((v) => v.trim()),
            ...(relation && {title: imageData[i].title})
          }
          const coreThemeListOfItem = imageData[i].coretheme.split(",").map((v) => v.trim())
          for(let j =0; j < coreThemeListOfItem.length; j++){
            const newLink = {
              source: imageData[i].id,
              target: coreThemeListOfItem[j]
            }
            links.push(newLink)
          }
         
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
            
            const titleBox = document.querySelector(`.t${i.slug}`)
            if(titleBox){

                titleBox.setAttribute("display", "auto")
            }
          })
          .on("mouseleave", function(d, i){
           
            const titleBox = document.querySelector(`.t${i.slug}`)
            if(titleBox){

                titleBox.setAttribute("display", "none")
            }
          })
  
        const imageSize = cSize 
        const ImagePos = imageSize/2
      nodeSelection
        .filter((d, i) =>  d.type === "parent")
        .append("g")
        .each(function (d, i) {
          const group = d3.select(this);
          group
          .append("circle")
          .attr("fill", (d) => d.color)
          .attr("r", d.size /4)

          const rectElement = group
            .append("rect")
            
            // Append the text element first to measure its size
            const textElement = group
              .append("text")
              .text(`${d.name}`) // Replace "dddd" with your dynamic text if needed
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
            document.body.style.cursor ="pointer"
        
        })
        .on("mouseleave", function(d, i){
            document.body.style.cursor ="auto"
        })
        .on("click", function(d, i){
          if(currentCore !== i.id){
            
            linkSelection
              .attr("stroke", (sd, si) => {
              
                if(sd.target.id === i.id){
                  return i.color
                }else{
                  return "black"
                }
              })
              .attr("stroke-width", (sd, si) => {
              
                if(sd.target.id === i.id){
                  return clickStroke
                }else{
                  return 1
                }
              })
            currentCore = i.id
            setCurrentItem(null)
          }else{
             linkSelection
              .attr("stroke", (sd, si) => {
                return "black"
              })
              .attr("stroke-width", 1)
              currentCore = ""
              setCurrentItem(null)
          }
          
          
        })
    
   
     
      nodeSelection
        .filter((d, i) =>  d.type === "item")
        .append("image")
        .attr("xlink:href", (d) => {
            // Check if the image URL is valid, otherwise use a local image
            return d.image !== "false" ? `${process.env.KB_API_FILE}/${d.image}` : getRandomPlaceHolder();
          })
        .attr("width", (d) => d.size/2)
        .attr("height", (d) => d.size/2)
        .attr("x", (d) => -d.size/4) // Adjust position
        .attr("y", (d) => -d.size/4) // Adjust position
        .attr("clip-path", (d,i) => d.type === "item" ? `circle(${d.size/4})` : `circle(${d.size/4})`)
        .attr("preserveAspectRatio", "xMidYMid slice") 
        .on("mouseenter", function(d, i){
          document.body.style.cursor ="pointer"
        })
        .on("mouseleave", function(d, i){
          document.body.style.cursor ="auto"
        })
        .on("click", (d, i) => {
          
          if(currentCore !== i.id){
            linkSelection
            .attr("stroke", (sd, si) => {
              if(sd.source.id === i.id){
                return "black"
              }else{
                return "black"
              }
            })
            .attr("stroke-width", (sd, si) => {
            
              if(sd.source.id === i.id){
                return clickStroke
              }else{
                return 1
              }
            })
            setCurrentItem(i)
            
            currentCore = i.id
          }else{
            linkSelection
            .attr("stroke", (sd, si) => {
              return "black"
            })
            .attr("stroke-width", 1)
            currentCore = ""
            setCurrentItem(null)
          }
         
         
        })

      if(relation){
        nodeSelection
        .append("g")
        .attr("class", (d, i) => {
            return `t${d.slug}`
        })
        .attr("display", "none")
        .each(function (d, i) {
            const group = d3.select(this);
            
            const rectElement = group
            .append("rect")
            
            // Append the text element first to measure its size
            const textElement = group
              .append("text")
              .text(`Go to: ${d.title}`) // Replace "dddd" with your dynamic text if needed
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
        .force("collision", d3.forceCollide().radius(function(d){
          return d.size/4
        }))
        .force(
          "links",
          d3
            .forceLink(links)
            .id((d) => d.id)
            .distance(width / 3)
            .strength(0.01)
        )
        .on("tick", ticked);
  
      function ticked() {
        nodeSelection.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
  
        linkSelection
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);
      }
  
      function dragStart(event, d) {
        simulation.alphaTarget(0.5).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
  
      function drag(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
  
      function dragEnd(event, d) {
        simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      }
    }, [imageData]);
  
    return (
      <div className="w-full h-full bg-white">
        <svg className="svg">
        
        </svg>
      </div>
    );
  };

export default DragAnimationFull;