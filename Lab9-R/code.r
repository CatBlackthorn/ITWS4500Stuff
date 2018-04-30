library(igraph);

pizzaPlaces <- read.csv("C:/Users/carlsc3/WebScience/Lab9-R/pizza.csv",header=TRUE, sep=",");
pizzaPlaces <- data.frame(lapply(pizzaPlaces, as.character), stringsAsFactors=F);
test <- pizzaPlaces;
beforeverts <- data.frame(name=c(pizzaPlaces$name), name2=c(pizzaPlaces$name), menuItems=c(pizzaPlaces$menus.name));
beforeverts <- data.frame(lapply(beforeverts, as.character), stringsAsFactors = F);
verts <- unique(c(beforeverts[,1]));
test <- na.omit(beforeverts);

edgelist = matrix(NA,nrow = 250, ncol=2);
n <- 1;
colnames(edgelist) <- c("name", "name2");
for (row1 in 1:nrow(test)) {
  name <- test[row1, "name"];
  pizza1 <- test[row1, "menuItems"];
  for (row2 in row1: nrow(test)) {
    name2 <- test[row2, "name2"];
    if (name != name2) {
      pizza2 <- test[row2, "menuItems"];
      if (pizza2 == "Taco Pizza") {
        edgelist[n,] <- c(test[row1, "name"], test[row2, "name2"]);
        n <- n + 1;
      }
    }
    
  }
}
g <- graph_from_edgelist(edgelist, directed=F);
V(g)$label.cex = 0.9;
plot(g, layout=layout_with_gem, vertex.size = 4,vertex.color="red")

