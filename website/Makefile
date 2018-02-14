
site:
	yarn build && \
		cp CNAME build/ && \
		cd build && \
		git init && \
		git add . && \
		git commit -am'dist' && \
		git remote add o $$(grep -o 'git@.*$$' ../../.git/config) && \
		git push origin --force HEAD:gh-pages
