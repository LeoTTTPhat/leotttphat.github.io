# Website CV

The website serves `../cv_Phat.pdf`. Its editable source is `cv_Phat.tex`.

Build from the repository root with a TeX Live installation:

```sh
mkdir -p /tmp/phat-cv-build
pdflatex -interaction=nonstopmode -halt-on-error -output-directory=/tmp/phat-cv-build cv/cv_Phat.tex
pdflatex -interaction=nonstopmode -halt-on-error -output-directory=/tmp/phat-cv-build cv/cv_Phat.tex
cp /tmp/phat-cv-build/cv_Phat.pdf cv_Phat.pdf
```

Render and inspect the resulting PDF before replacing the website download. Update the CV link version in HTML when changing the download. The `wsdm-acceptance` PDF destination keeps existing metric links independent of pagination.

The November 2026 update adds Injected Gold, Removal Without Revocation, TRAVA, Conspicuity Collapse, SemReuse, and the JAWs workshop presentation. Existing education, experience, skills, teaching, awards, service, and referees are retained.

New-entry checks used the [co-author publication list](https://lexuanbach.github.io/), the TRAVA manuscript, the [SemReuse arXiv record](https://arxiv.org/abs/2610.16035), and the [JAWs program](https://conf.researchr.org/home/ase-2026/jaws-2-2026). TRAVA uses the manuscript's author order and equal-contribution marks and is labelled EACL Findings. Conspicuity Collapse uses the website's 2027 volume year, with its October 2026 online date stated separately. The AsiaCCS rate includes conditional acceptances, matching the co-author's current record. Preprints and workshop presentations have their own subsections.

Keep Injected Gold (KDD 2027) and TRAVA (EACL 2027 Findings) unlinked until their final versions are complete.
