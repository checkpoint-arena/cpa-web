import { useState } from "react"
import { createStyles, Header, Container, Group, Image, Burger, Paper, Transition, rem } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import Link from "next/link"
import { usePathname } from "next/navigation"

const HEADER_HEIGHT = rem(60)

const useStyles = createStyles((theme) => ({
    root: {
        position: "relative",
        zIndex: 10,
    },

    dropdown: {
        position: "absolute",
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        overflow: "hidden",

        [theme.fn.largerThan("sm")]: {
            display: "none",
        },
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
    },

    links: {
        [theme.fn.smallerThan("sm")]: {
            display: "none",
        },
    },

    burger: {
        [theme.fn.largerThan("sm")]: {
            display: "none",
        },
    },

    link: {
        display: "block",
        lineHeight: 1,
        padding: `${rem(8)} ${rem(12)}`,
        borderRadius: theme.radius.sm,
        textDecoration: "none",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        },

        [theme.fn.smallerThan("sm")]: {
            borderRadius: 0,
            padding: theme.spacing.md,
        },
    },

    linkActive: {
        "&, &:hover": {
            backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
            color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
        },
    },
}))

interface HeaderResponsiveProps {
    links: { link: string; label: string }[]
}

export function HeaderResponsive({ links }: HeaderResponsiveProps) {
    const [opened, { toggle, close }] = useDisclosure(false)
    const currentRoute = usePathname()
    // TODO: How to handle nested paths?
    const [active, setActive] = useState(currentRoute)
    const { classes, cx } = useStyles()

    const items = links.map((link) => (
        <Link
            key={link.label}
            href={link.link}
            className={cx(classes.link, { [classes.linkActive]: active === link.link })}
            onClick={() => {
                setActive(link.link)
                close()
            }}
        >
            {link.label}
        </Link>
    ))

    return (
        <Header height={HEADER_HEIGHT} mb={16} className={classes.root}>
            <Container className={classes.header}>
                <Image alt="" src="/cpa.png" height={26} width="auto" fit="contain" />
                <Group spacing={5} className={classes.links}>
                    {items}
                </Group>

                <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />

                <Transition transition="pop-top-right" duration={200} mounted={opened}>
                    {(styles) => (
                        <Paper className={classes.dropdown} withBorder style={styles}>
                            {items}
                        </Paper>
                    )}
                </Transition>
            </Container>
        </Header>
    )
}
