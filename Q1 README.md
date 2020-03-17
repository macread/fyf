If the table does indeed need to be sharded, there are a few things to be be considered.

- Is there some logical breakdown of the table so the rows can be categorized. For example is there ZIP Code so 
you could divide the rows by east and west?

- When pulling data from accross the entire database, all shards will have to be searched and then joined. Perhaps
programmatically, so it would be best to have some sort of API set up to access the data so getting at the data can
be abstracted out.

There are other things that can be done to avoid sharding. Perhaps more powerful hardware. Or partitioning the database.
Partitioning reduces index size and seaarch effort.