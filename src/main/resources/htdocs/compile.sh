files='
	./js/index.js
	
	./js/controllers/Controller.Viewport.js
	
	./js/models/Model.Story.js
	./js/stores/Store.Minima.js
	
	./js/views/View.Viewport.js
'

rm all.js
for f in $files; do
	echo >> all.js
	echo "//$f" >> all.js
	echo >> all.js
	cat $f >> all.js
	echo >> all.js
done 