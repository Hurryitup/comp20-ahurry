# Lab 6
## Aditya Hurry

### What's been implemented
* I've implemented everything asked for in the specifications. Parts 2 and 3 were experimented with locally and so weren't pushed to my repo.

### Anyone with whom I've collaborated
* No one

### Approximate number of hours spent
* 1 hour

### Is it possible to request the data from a different origin (e.g., http://messagehub.herokuapp.com/) or from your local machine (from file:///) from using XMLHttpRequest? Why or why not?
* No it isn't - the same-origin policy specifies that the document or script being loaded must be from the same domain as the original page being loaded from. They have the same origin if the protocol, port and host are the same for both pages.
* For files, it is possible to access another file, but only if the parent directory of the originating file is an ancestor directory of the target file.