#!/usr/bin/env bash
# Install design-skills into this project's .cursor/ directory.
#
# Symlinks from ~/Sites/design-skills (canonical library) — never copies content.
#
# Usage:
#   ./.cursor/install-design-skills.sh
#   ./.cursor/install-design-skills.sh --dry-run
#   ./.cursor/install-design-skills.sh --uninstall
#
# Installs:
#   .cursor/skills/   ← design-skills/skills/**/<skill>
#   .cursor/commands/ ← design-skills/commands/*.md
#   .cursor/rules/    ← design-skills/rules/*.mdc

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DESIGN_SKILLS="/Users/aaron.benjamin/Sites/design-skills"
SKILLS_TARGET="${PROJECT_DIR}/.cursor/skills"
COMMANDS_TARGET="${PROJECT_DIR}/.cursor/commands"
RULES_TARGET="${PROJECT_DIR}/.cursor/rules"

DRY_RUN=false
DO_UNINSTALL=false

for arg in "$@"; do
  case "$arg" in
    --dry-run)   DRY_RUN=true ;;
    --uninstall) DO_UNINSTALL=true ;;
    --help|-h)
      sed -n '/^# Usage:/,/^$/p' "$0" | sed 's/^# //; s/^#//'
      exit 0
      ;;
    *)
      printf 'Unknown argument: %s\n' "$arg" >&2
      exit 1
      ;;
  esac
done

if [[ ! -d "$DESIGN_SKILLS/skills" ]]; then
  printf 'design-skills not found at %s\n' "$DESIGN_SKILLS" >&2
  exit 1
fi

log()  { printf '  %s\n' "$*"; }
info() { printf '\n→ %s\n' "$*"; }
dry()  { printf '  [dry-run] %s\n' "$*"; }

ensure_dir() {
  local dir="$1"
  if [[ "$DRY_RUN" == true ]]; then
    dry "mkdir -p $dir"
  else
    mkdir -p "$dir"
  fi
}

link_path() {
  local src="$1"
  local link="$2"

  if [[ "$DO_UNINSTALL" == true ]]; then
    if [[ -L "$link" && "$(readlink "$link")" == "$src" ]]; then
      if [[ "$DRY_RUN" == true ]]; then
        dry "rm $link"
      else
        rm "$link"
        log "removed $(basename "$link")"
      fi
    fi
    return
  fi

  if [[ -L "$link" && "$(readlink "$link")" == "$src" ]]; then
    log "up-to-date  $(basename "$link")"
    return
  fi

  if [[ -e "$link" && ! -L "$link" ]]; then
    log "skip  $(basename "$link") (exists and is not a symlink)"
    return
  fi

  if [[ -L "$link" ]]; then
    if [[ "$DRY_RUN" == true ]]; then
      dry "rm $link  (stale)"
    else
      rm "$link"
    fi
  fi

  if [[ "$DRY_RUN" == true ]]; then
    dry "ln -s $src $link"
  else
    ln -s "$src" "$link"
    log "linked  $(basename "$link")"
  fi
}

collect_skills() {
  find "$DESIGN_SKILLS/skills" -maxdepth 3 -name "SKILL.md" -not -path "*/node_modules/*" \
    | while IFS= read -r skill_md; do
        dirname "$skill_md"
      done \
    | sort
}

printf '\n╔══════════════════════════════════════════════════════╗\n'
printf   '║  thoughtfulDesign ← design-skills%s\n' "$([ "$DRY_RUN" == true ] && echo " — DRY RUN" || echo "")"
printf   '╚══════════════════════════════════════════════════════╝\n'
printf 'Project: %s\n' "$PROJECT_DIR"
printf 'Source:  %s\n' "$DESIGN_SKILLS"

info "Skills → ${SKILLS_TARGET}"
ensure_dir "$SKILLS_TARGET"
while IFS= read -r skill_dir; do
  skill_name="$(basename "$skill_dir")"
  link_skill="${SKILLS_TARGET}/${skill_name}"
  link_path "$skill_dir" "$link_skill"
done < <(collect_skills)

info "Commands → ${COMMANDS_TARGET}"
ensure_dir "$COMMANDS_TARGET"
for cmd in "$DESIGN_SKILLS"/commands/*.md; do
  [[ -f "$cmd" ]] || continue
  link_path "$cmd" "${COMMANDS_TARGET}/$(basename "$cmd")"
done

info "Rules → ${RULES_TARGET}"
ensure_dir "$RULES_TARGET"
for rule in "$DESIGN_SKILLS"/rules/*.mdc; do
  [[ -f "$rule" ]] || continue
  link_path "$rule" "${RULES_TARGET}/$(basename "$rule")"
done

if [[ "$DO_UNINSTALL" == true ]]; then
  printf '\nDone. Project design-skills links removed.\n'
else
  printf '\n✓ Project install complete.\n'
  printf '  Skills:   %s\n' "$SKILLS_TARGET"
  printf '  Commands: %s\n' "$COMMANDS_TARGET"
  printf '  Rules:    %s\n' "$RULES_TARGET"
  printf '\nProject-specific skills (e.g. voice/) are preserved.\n'
  printf 'Reload Cursor to pick up new skills and commands.\n'
fi
